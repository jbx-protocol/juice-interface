// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {
    UniswapV2Router02
} from "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/IBudgetStore.sol";

import "./TicketStore.sol";

/**
  @notice This contract exposes all external interactions with the Juice ecosystem.
  @dev  1. A project owner issues their Tickets.
        2. A project owner configures their first Budget.
           You can reconfigure your Budget at any time, but if your current Budget has already
           received contribution, the new configuration will only affect your Budget that automatically 
           goes into effect once the current one expires.
        3. Any address (end user or smart contract) can contribute funds to your Budget.
           You can configure your Budget to `want` any of the tokens on the allow list (DAI, sUSD, ...).
           In return, your contributors receive some of your project's Tickets minted by this contract. 
           They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
              - The contributed amount. The more someone contributes, the more Tickets they'll receive.
              - The target amount of your Budget. The bigger your Budget's target amount, the fewer tickets that'll be minted for each `want` token contributed.
              - The Budget's weight, which is a number that decreases with each of your Budgets at a configured `bias` rate. 
                This rate is called a `bias` because it allows you to give out more Tickets to contributors to your 
                current Budget than to future budgets.
        4. As the project owner, you can collect any funds made to your Budget within your configured target.
           Any overflow will be accounted for seperately. 
           At any point, anyone can execute a transaction to swap any accumulated overflow of `want` tokens into your Ticket's reward Token.
        5. Your project's Ticket holders can redeem their Tickets for a share of reward tokens that have been swapped for.

  @dev This contract manages all funds, including:
        - contributions made to Budgets.
        - rewards for contributing to Budgets.

  
  @dev A project owner can transfer their funds and reward, along with the power to mint/burn their Tickets, from this contract to another allowed contract at any time.
       Contracts that are allowed to take on the power to mint/burn Tickets can be set by this controller's admin.
*/
contract Juicer is IJuicer {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Budget for Budget.Data;

    /// @dev Limit sustain, redeem, swap, and tap to being called one at a time.
    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "Juicer: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    // --- private properties --- //

    // If a particular token is allowed as a `want` token of a Money pool.
    mapping(IERC20 => bool) private wantTokenIsAllowed;

    // If a particulate contract is available for project owners to migrate their Tickets to.
    mapping(address => bool) private migrationContractIsAllowed;

    // --- public properties --- //

    /// @notice The admin of the contract who makes admin fees.
    address public admin;

    /// @notice The contract storing all Budget state variables.
    IBudgetStore public immutable override budgetStore;

    /// @notice The contract that manages the Tickets.
    ITicketStore public immutable override ticketStore;

    /// @notice The percent fee the contract owner takes from overflow.
    uint256 public immutable fee;

    /// @notice The router that does the swaps.
    UniswapV2Router02 public immutable router;

    // --- public views --- //

    /**
        @notice The amount of unminted tickets that are reserved for owners, beneficieries, and the admin.
        @dev Reserved tickets are only mintable once a Budget expires.
        @dev This logic should be the same as mintReservedTickets.
        @param _issuer The Tickets issuer whos Budgets are being searched for unminted reserved tickets.
        @return _issuers The amount of unminted reserved tickets belonging to issuer of the tickets.
        @return _beneficiaries The amount of unminted reserved tickets belonging to beneficiaries.
        @return _admin The amount of unminted reserved tickets belonging to the admin.
    */
    function getReservedTickets(address _issuer)
        public
        view
        override
        returns (
            uint256 _issuers,
            uint256 _beneficiaries,
            uint256 _admin
        )
    {
        // Get a reference to the owner's tickets.
        ITickets _tickets = ticketStore.tickets(_issuer);

        // If the owner doesn't have tickets, throw.
        require(
            _tickets != ITickets(0),
            "Juicer::getReservedTickets: NOT_FOUND"
        );

        // Get a reference to the owner's latest Budget.
        Budget.Data memory _budget = budgetStore.getLatestBudget(_issuer);

        // Iterate sequentially through the owner's Budgets, starting with the latest one.
        // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
        while (_budget.id > 0 && !_budget.hasMintedReserves) {
            // If the budget has overflow and is redistributing, it has unminted reserved tickets.
            if (
                _budget.total > _budget.target &&
                _budget._state() == Budget.State.Redistributing
            ) {
                // Unminted reserved tickets are all relavative to the amount of overflow available.
                uint256 _overflow = _budget.total.sub(_budget.target);

                // The admin gets the admin fee percentage.
                _admin = _admin.add(_budget._weighted(_overflow, fee));

                // The owner gets the budget's owner percentage, if one is specified.
                if (_budget.o > 0) {
                    _issuers = _issuers.add(
                        _budget._weighted(_overflow, _budget.o)
                    );
                }

                // The beneficiary gets the budget's beneficiary percentage, if one is specified.
                if (_budget.b > 0) {
                    _beneficiaries = _beneficiaries.add(
                        _budget._weighted(_overflow, _budget.b)
                    );
                }
            }

            // Continue the loop with the previous Budget.
            _budget = budgetStore.getBudget(_budget.previous);
        }
    }

    // --- external transactions --- //

    /** 
      @param _budgetStore The BudgetStore to use.
      @param _ticketStore The TicketStore to use.
      @param _fee The percentage of overflow from all ecosystem Budgets to run through the admin's Budget.
      @param _wantTokenAllowList The tokens that are allowed as `want` tokens in Budgets.
      @param _router The router to use to swap tokens.
    */
    constructor(
        IBudgetStore _budgetStore,
        ITicketStore _ticketStore,
        uint256 _fee,
        IERC20[] memory _wantTokenAllowList,
        UniswapV2Router02 _router
    ) public {
        budgetStore = _budgetStore;
        ticketStore = _ticketStore;
        fee = _fee;
        router = _router;

        // Populate the mapping that will be used to validate Budget `want` token configuration.
        for (uint256 i = 0; i < _wantTokenAllowList.length; i++)
            wantTokenIsAllowed[_wantTokenAllowList[i]] = true;
    }

    /**
        @notice Issues an owner's Tickets that'll be handed out by their budgets in exchange for sustainments.
        @dev Deploys an owner's Ticket ERC-20 token contract.
        @param _name The ERC-20's name.
        @param _symbol The ERC-20's symbol.
        @param _rewardToken The token that the Tickets are redeemable for.
    */
    function issueTickets(
        string calldata _name,
        string calldata _symbol,
        IERC20 _rewardToken
    ) external override {
        // An owner only needs to issue their Tickets once before they can be used.
        require(
            ticketStore.tickets(msg.sender) == ITickets(0),
            "Juicer::issueTickets: ALREADY_ISSUED"
        );

        // Save the created Tickets contract in the store.
        ticketStore.saveTickets(
            msg.sender,
            // Create the contract in this Juicer contract in order to have mint and burn privileges.
            new Tickets(_name, _symbol, _rewardToken)
        );

        emit IssueTickets(msg.sender, _name, _symbol, _rewardToken);
    }

    /**
        @notice Configures the sustainability target and duration of the sender's current Budget if it hasn't yet received sustainments, or
        sets the properties of the Budget that will take effect once the current one expires.
        @dev The msg.sender is the owner of the budget.
        @param _target The cashflow target to set.
        @param _want The token that the Budget wants.
        @param _duration The duration to set, measured in seconds.
        @param _brief A brief description about the budget.
        @param _link A link to information about the Budget.
        @param _bias A number from 95-100 indicating how valuable a contribution to the current Budget is 
        compared to the owners previous Budget.
        If it's 100, each Budget will have equal weight.
        If it's 95, each Money pool will be 95% as valuable as the previous Money pool's weight.
        This is `bias` is realized through the amount of Ticket distributed per unit of contribution made.
        @param _o The percentage of this Budget's overflow to reserve for the owner.
        @param _b The percentage of this Budget's overflow to reserve for a beneficiary address. 
        This can be another contract, or an end user address.
        An example would be a contract that reserves for Gitcoin grant matching.
        @param _bAddress The address of the beneficiary contract that can mint the reserved beneficiary percentage.
        @return _budgetId The ID of the Budget that was successfully configured.
    */
    function configureBudget(
        uint256 _target,
        uint256 _duration,
        IERC20 _want,
        string calldata _brief,
        string calldata _link,
        uint256 _bias,
        uint256 _o,
        uint256 _b,
        address _bAddress
    ) external override returns (uint256) {
        // The `want` token must be supported.
        require(
            wantTokenIsAllowed[_want],
            "Juicer::configureBudget: UNSUPPORTED_WANT"
        );
        // The `bias` token must be between 95 and 100.
        require(
            _bias >= 95 && _bias <= 100,
            "Juicer:configureBudget: BAD_BIAS"
        );
        // If the beneficiary reserve percentage is greater than 0, an address must be provided.
        require(
            _b == 0 || _bAddress != address(0),
            "Juicer::configureBudget: BAD_ADDRESS"
        );
        // The reserved percentages must add up to less than or equal to 100.
        require(
            _o.add(_b).add(fee) <= 100,
            "Juicer::configureBudget: BAD_PERCENTAGES"
        );

        // Get a reference to the owner's Tickets.
        ITickets _tickets = ticketStore.tickets(msg.sender);

        // Make sure the owner has already issued Tickets.
        require(
            _tickets != ITickets(0),
            "Juicer::configureBudget: NEEDS_INITIALIZATION"
        );

        // Return's the owner's editable budget. Creates one if one doesn't already exists.
        Budget.Data memory _budget =
            budgetStore.ensureStandbyBudget(msg.sender);

        // Set the properties of the budget.
        _budget.brief = _brief;
        _budget.link = _link;
        _budget.target = _target;
        _budget.duration = _duration;
        _budget.want = _want;
        // Reset the start time to now if the owner's current Budget doesn't yet have sustainments.
        _budget.start = budgetStore.getCurrentBudget(msg.sender).total == 0
            ? block.timestamp
            : _budget.start;
        _budget.bias = _bias;
        _budget.o = _o;
        _budget.b = _b;
        _budget.bAddress = _bAddress;

        // Save the Budget in the store.
        budgetStore.saveBudget(_budget);

        // Track this new `want` token in the store.
        // This is necessary for proper accounting when managing overflow.
        budgetStore.trackWantedToken(msg.sender, _tickets.rewardToken(), _want);

        emit ConfigureBudget(
            _budget.id,
            _budget.owner,
            _budget.target,
            _budget.duration,
            _budget.want,
            _budget.link,
            _budget.bias,
            _o,
            _b,
            _bAddress
        );

        return _budget.id;
    }

    /**
        @notice Contribute funds to an owner's active Budget.
        @dev Mints the owner's Tickets proportional to the amount of the contribution.
        @dev The sender must approve this contract to transfer the specified amount of tokens.
        @param _owner The owner of the budget to contribute funds to.
        @param _amount Amount of the contribution.
        @param _token The token used for the contribution. Must match the `want` token for the Budget being sustained.
        @param _beneficiary The address to transfer the newly minted Tickets to. 
        @return _budgetId The ID of the Budget that successfully received the contribution.
    */
    function payOwner(
        address _owner,
        uint256 _amount,
        IERC20 _token,
        address _beneficiary
    ) external override lock returns (uint256) {
        // Positive contributions only.
        require(_amount > 0, "Juicer::sustainOwner: BAD_AMOUNT");

        // Find the Budget that this contribution should go towards.
        // Creates a new budget based on the owner's most recent one if there isn't currently a Budget accepting contributions.
        Budget.Data memory _budget = budgetStore.ensureActiveBudget(_owner);

        // Make sure the token being contributed matches the Budget's `want` token.
        require(
            _token == _budget.want,
            "Juicer::sustainOwner: UNEXPECTED_WANT"
        );

        // Add the amount to the Budget.
        _budget.total = _budget.total.add(_amount);

        // Get the amount of overflow funds that have been contributed to the Budget after this contribution is made.
        uint256 _overflow =
            _budget.total > _budget.target
                ? _budget.total.sub(_budget.target)
                : 0;

        // If the owner is contributing to themselves and not all of the contribution amount went to the Budget's overflow,
        // auto tap so the owner doesn't have to send a second transaction to tap the funds.
        if (_budget.owner == msg.sender && _amount > _overflow) {
            // Mark the amount of the contribution that didn't go towards overflow as tapped.
            _budget.tapped = _budget.tapped.add(_amount.sub(_overflow));
            // Transfer the overflow only, since the rest has been marked as tapped.
            if (_overflow > 0) {
                _budget.want.safeTransferFrom(
                    msg.sender,
                    address(this),
                    _overflow
                );
            }
            emit TapBudget(
                _budget.id,
                msg.sender,
                msg.sender,
                _overflow,
                _budget.want
            );
        } else {
            // Transfer the amount from the contributor to this contract.
            _budget.want.safeTransferFrom(msg.sender, address(this), _amount);
        }

        // Save the budget to the store.
        budgetStore.saveBudget(_budget);

        // Get a reference to the Budget owner's Tickets.
        ITickets _tickets = ticketStore.tickets(_budget.owner);

        // If the Budget has overflow, add the amount of contributed funds that went to overflow
        // to the amount swappable for the Tickets' reward token.
        // Ideally the swap would happen here. In order to save gas, the swappable amounts are being stored to be bulk swapped in another transaction.
        if (_overflow > 0) {
            ticketStore.addSwappable(
                _budget.owner,
                _budget.want,
                // The amount of this contribution that is going towards overflow.
                _amount > _overflow ? _overflow : _amount,
                _tickets.rewardToken()
            );
        }

        // Mint the appropriate amount of tickets for the contributor.
        _tickets.mint(
            _beneficiary,
            _budget._weighted(_amount, _budget._unreserved(fee))
        );

        emit SustainBudget(
            _budget.id,
            _budget.owner,
            _beneficiary,
            msg.sender,
            _amount,
            _budget.want
        );

        return _budget.id;
    }

    /**
        @notice Swaps any funds available to be swapped for the specified pair.
        @dev The swap is being made from the token used to contribute to a Budget,
        into the token used to reward contributors with once their Tickets are redeemed.
        @param _issuer The issuer of the Tickets to swap funds for.
        @param _from The token to swap from.
        @param _amount Amount to swap.
        @param _to The token to swap to.
        @param _minSwappedAmount The minumum amount of tokens to swap to.
    */
    function swap(
        address _issuer,
        IERC20 _from,
        uint256 _amount,
        IERC20 _to,
        uint256 _minSwappedAmount
    ) external override lock {
        // Must swap a positive amount.
        require(_amount > 0, "Juicer::swap: BAD_AMOUNT");

        // Get the amount of funds available to be swapped for the specified issuer and token pair.
        uint256 _swappable = ticketStore.swappable(_issuer, _from, _to);

        // The amount being swapped must be less than the amount swappable.
        require(_amount < _swappable, "Juicer::swap: INSUFFICIENT_FUNDS");

        // Subtract the amount of available funds to swap.
        ticketStore.subtractSwappable(_issuer, _from, _amount, _to);

        // Approve the router to manage this contract's funds.
        require(
            _from.approve(address(router), _amount),
            "Juicer::swap: APPROVE_FAILED."
        );

        // Create the routing path.
        address[] memory path = new address[](2);
        path[0] = address(_from);
        path[1] = router.WETH();
        path[2] = address(_to);

        // Conduct the swap and returns the amount of `to` tokens received.
        uint256[] memory _amounts =
            router.swapExactTokensForTokens(
                _amount,
                _minSwappedAmount,
                path,
                address(this),
                block.timestamp
            );

        // TODO verify its the 1st element.
        uint256 _swappedAmount = _amounts[1];

        // The swapped tokens can now be claimed by the issuer's Ticket holders as rewards. Track this in the store.
        ticketStore.addClaimableRewards(_issuer, _to, _swappedAmount);

        emit Swap(_issuer, _from, _amount, _to, _swappedAmount);
    }

    /**
        @notice Addresses can redeem their Tickets to claim reward tokens.
        @param _issuer The issuer of the Tickets being redeemed.
        @param _amount The amount of Tickets to redeem.
        @param _minRewardAmount The minimum amount of rewards tokens expected in return.
        @param _beneficiary The address to send the reward to.
        @return _rewardToken The token that was redeemed for.
    */
    function redeem(
        address _issuer,
        uint256 _amount,
        uint256 _minRewardAmount,
        address _beneficiary
    ) external override lock returns (IERC20 _rewardToken) {
        // Get a reference to the Tickets being redeemed.
        ITickets _tickets = ticketStore.tickets(_issuer);

        // Set the returned value.
        _rewardToken = _tickets.rewardToken();

        // The amount of reward tokens claimable by the message sender from the specified issuer by redeeming the specified amount.
        // Multiply by the active proportion of the golden ratio. This incentizes HODLing tickets.
        uint256 _adjustedClaimableRewardsAmount =
            ticketStore.getClaimableRewardsAmount(
                msg.sender,
                _amount,
                _issuer,
                382
            );

        // The amount being claimed must be less than the amount claimable.
        require(
            _minRewardAmount >= _adjustedClaimableRewardsAmount,
            "Juicer::redeem: INSUFFICIENT_FUNDS"
        );

        // Burn the redeemed tickets.
        _tickets.burn(msg.sender, _amount);

        // Subtract the claimed rewards from the total amount claimable.
        ticketStore.subtractClaimableRewards(
            _issuer,
            _rewardToken,
            _adjustedClaimableRewardsAmount
        );

        // Transfer funds to the specified address.
        _rewardToken.safeTransfer(
            _beneficiary,
            _adjustedClaimableRewardsAmount
        );

        emit Redeem(
            msg.sender,
            _beneficiary,
            _amount,
            _adjustedClaimableRewardsAmount
        );
    }

    /**
        @notice Tap into funds that have been contrubuted to your Budgets.
        @param _budgetId The ID of the Budget to tap.
        @param _amount The amount to tap.
        @param _beneficiary The address to transfer the funds to.
    */
    function tapBudget(
        uint256 _budgetId,
        uint256 _amount,
        address _beneficiary
    ) external override lock {
        // Get a reference to the Budget being tapped.
        Budget.Data memory _budget = budgetStore.getBudget(_budgetId);

        require(_budget.id > 0, "Juicer::tapBudget: NOT_FOUND");

        // Only a Budget owner can tap its funds.
        require(_budget.owner == msg.sender, "Juicer::tapBudget: UNAUTHORIZED");

        // The amount being tapped must be less than the tappable amount.
        require(
            _amount <= _budget._tappableAmount(),
            "Juicer::tapBudget: INSUFFICIENT_FUNDS"
        );

        // Add the amount to the Budget's tapped amount.
        _budget.tapped = _budget.tapped.add(_amount);

        // Save the budget to the store.
        budgetStore.saveBudget(_budget);

        // Transfer the funds to the specified address.
        _budget.want.safeTransfer(_beneficiary, _amount);

        emit TapBudget(
            _budgetId,
            msg.sender,
            _beneficiary,
            _amount,
            _budget.want
        );
    }

    /**
        @notice Mints the amount of unminted tickets that are reserved for owners, beneficieries, and the admin.
        @dev Reserved tickets are only mintable once a Budget expires.
        @dev This logic should be the same as mintReservedTickets.
        @param _issuer The Tickets issuer whos Budgets are being searched for unminted reserved tickets.
    */
    function mintReservedTickets(address _issuer) external override {
        // Get a reference to the owner's tickets.
        ITickets _tickets = ticketStore.tickets(_issuer);

        // If the owner doesn't have tickets, throw.
        require(_tickets != ITickets(0), "Juicer::claim: NOT_FOUND");

        // Get a reference to the owner's latest Budget.
        Budget.Data memory _budget = budgetStore.getLatestBudget(_issuer);

        // Iterate sequentially through the owner's Budgets, starting with the latest one.
        // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
        while (_budget.id > 0 && !_budget.hasMintedReserves) {
            // If the budget has overflow and is redistributing, it has unminted reserved tickets.
            if (
                _budget.total > _budget.target &&
                _budget._state() == Budget.State.Redistributing
            ) {
                // Unminted reserved tickets are all relavative to the amount of overflow available.
                uint256 _overflow = _budget.total.sub(_budget.target);

                // The admin gets the admin fee percentage.
                _tickets.mint(admin, _budget._weighted(_overflow, fee));

                // The owner gets the budget's owner percentage, if one is specified.
                if (_budget.o > 0)
                    _tickets.mint(
                        _budget.owner,
                        _budget._weighted(_overflow, _budget.o)
                    );

                // The beneficiary gets the budget's beneficiary percentage, if one is specified.
                if (_budget.b > 0)
                    _tickets.mint(
                        _budget.bAddress,
                        _budget._weighted(_overflow, _budget.b)
                    );

                // Mark the budget as having minted reserves.
                _budget.hasMintedReserves = true;

                // Save the budget to the store;
                budgetStore.saveBudget(_budget);
            }

            // Continue the loop with the previous Budget.
            _budget = budgetStore.getBudget(_budget.previous);
        }
        emit MintReservedTickets(msg.sender, _issuer);
    }

    /**
        @notice Cleans the `want` token tracking array for an owner and a redeemable token.
        @dev This rarely needs to get called, if ever.
        @dev It's only useful if an owner has iterated through many `want` tokens that are just taking up space.
        @param _owner The owner of the Budgets that have specified `want` tokens.
        @param _token The reward token to clean accepted tokens for.
    */
    function cleanTrackedWantedTokens(address _owner, IERC20 _token)
        external
        override
    {
        // Get a reference to all of the token's the owner has wanted since this transaction was last called.
        IERC20[] memory _currentWantedTokens =
            budgetStore.getWantedTokens(_owner, _token);

        // Clear the array entirely in the store so that it can be repopulated.
        budgetStore.clearWantedTokens(_owner, _token);

        // Get a reference to the current Budget for the owner. The `want` token for this Budget shouldn't be cleared.
        Budget.Data memory _cBudget = budgetStore.getCurrentBudget(_owner);

        // For each token currently tracked, check to see if there are swappable funds from the token.
        for (uint256 i = 0; i < _currentWantedTokens.length; i++) {
            IERC20 _wantedToken = _currentWantedTokens[i];
            // Only retrack tokens in used.
            if (
                _cBudget.want == _wantedToken ||
                ticketStore.swappable(_owner, _wantedToken, _token) > 0
            ) {
                // Add the token back to the store.
                budgetStore.trackWantedToken(msg.sender, _token, _wantedToken);
            }
        }
        emit CleanedTrackedWantedTokens(_owner, _token);
    }

    /**
        @notice Allows an owner to migrate their Tickets' control to another contract.
        @dev This makes each owner's Ticket's portable.
        @dev Make sure you know what you're doing. This is a one way migration
        @param _to The contract that will gain minting and burning privileges over the Tickets.
    */
    function migrate(address _to) external override {
        require(
            migrationContractIsAllowed[_to],
            "Juicer:migrateTickets: BAD_DESTINATION"
        );

        // Get a reference to the owner's Tickets.
        ITickets _tickets = ticketStore.tickets(msg.sender);

        // The owner must have issued Tickets.
        require(_tickets != ITickets(0), "Juicer::migrateTickets: NOT_FOUND");

        // Give the new owner admin privileges.
        _tickets.grantRole_(_tickets.DEFAULT_ADMIN_ROLE_(), _to);

        // Remove privileges from this contract.
        _tickets.revokeRole_(_tickets.DEFAULT_ADMIN_ROLE_(), address(this));

        IERC20 _rewardToken = _tickets.rewardToken();

        // Move all claimable rewards for this issuer.
        uint256 _claimable = ticketStore.claimable(msg.sender, _rewardToken);
        _rewardToken.safeTransfer(_to, _claimable);

        // Move all swappable funds for this issuer.
        IERC20[] memory _wantedTokens =
            budgetStore.getWantedTokens(msg.sender, _rewardToken);

        for (uint256 i = 0; i < _wantedTokens.length; i++) {
            uint256 _swappable =
                ticketStore.swappable(
                    msg.sender,
                    _wantedTokens[i],
                    _rewardToken
                );
            _wantedTokens[i].safeTransfer(_to, _swappable);
        }

        emit Migrate(_to);
    }

    /**
        @notice The admin of this contract.
        @dev Can be set once. The admin will set this upon being deployed.
        @param _admin The admin to set.
    */
    function setAdmin(address _admin) external override {
        require(admin == address(0), "Juicer::setAdmin: ALREADY_SET");
        admin = _admin;
    }

    /**
        @notice Adds to the contract addresses that project owners can migrate their Tickets to.
        @param _contract The contract to allow.
    */
    function addToMigrationAllowList(address _contract) external override {
        require(
            msg.sender == admin,
            "Juicer::setMigrationAllowList: UNAUTHORIZED"
        );
        migrationContractIsAllowed[_contract] = true;
    }
}
