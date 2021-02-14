// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

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
        3. Any address (end user or smart contract) can contribute funds to your Budget.
           You can configure your Budget to `want` any of the tokens on the allow list (DAI, sUSD, ...).
           In return, your contributors receive some of your project's Tickets minted by this contract. 
           They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
              - The contributed amount. The more someone contributes, the more Tickets they'll receive.
              - The target amount of your Budget. The bigger your Budget's target amount, the fewer tickets that'll be minted for each `want` token contributed.
              - The Budget's weight, which is a number that decreases with each of your Budgets at a configured `discountRate` rate. 
                This rate is called a `discountRate` because it allows you to give out more Tickets to contributors to your 
                current Budget than to future budgets.
        4. As the project owner, you can collect any funds made to your Budget within your configured target.
           Any overflow will be accounted for seperately. 
        5. Your project's Ticket holders can redeem their Tickets for a share of your project's accumulated overflow.
        6. You can reconfigure your Budget at any time with the approval of your Ticket holders, 
           but if your current Budget has already received contribution, the new configuration 
           will only affect your Budget that automatically goes into effect once the current one expires.

  @dev This contract manages all funds.
  
  @dev A project owner can transfer their funds, along with the power to mint/burn their Tickets, from this contract to another allowed contract at any time.
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

    // If a particulate contract is available for project owners to migrate their Tickets to.
    mapping(address => bool) private migrationContractIsAllowed;

    // --- public properties --- //

    /// @notice The amount of time a Budget must be in standby before it can become active.
    /// @dev This allows for a voting period of 3 days.
    uint256 public constant override RECONFIGURATION_VOTING_PERIOD = 269200;

    /// @notice The admin of the contract who makes admin fees.
    address public override admin;

    /// @notice The contract storing all Budget state variables.
    IBudgetStore public immutable override budgetStore;

    /// @notice The contract that manages the Tickets.
    ITicketStore public immutable override ticketStore;

    /// @notice The percent fee the contract owner takes from overflow.
    uint256 public immutable override fee;

    /// @notice The amount claimable for each address, including all beneficiaries and the admin.
    mapping(address => uint256) public claimable;

    /// @notice The address of the DAI ERC-20 token.
    IERC20 public dai;

    // --- external views --- //

    /**
        @notice The amount of pending admin fees, donatations to beneficiaries, and mintable tickets for budget owners.
        @dev Reserved tickets are only mintable once a Budget expires.
        @dev This logic should be the same as `distributeReserves` in Juicer.
        @param _issuer The Tickets issuer whos Budgets are being searched for unminted reserved tickets.
        @return issuerTickets The amount of unminted reserved tickets belonging to issuer of the tickets.
        @return adminFees The amount of fees belonging to the admin.
        @return beneficiaryDonations The amount of donations belonging to the beneficiaries.
    */
    function getDistributableReserves(address _issuer)
        public
        view
        override
        returns (
            uint256 issuerTickets,
            uint256 adminFees,
            uint256 beneficiaryDonations
        )
    {
        // Get a reference to the owner's tickets.
        Tickets _tickets = ticketStore.tickets(_issuer);

        // If the owner doesn't have tickets, throw.
        require(
            _tickets != Tickets(0),
            "ReservedTicketsView::getReservedTickets: NOT_FOUND"
        );

        // Get a reference to the owner's latest Budget.
        Budget.Data memory _budget = budgetStore.getLatestBudget(_issuer);

        // Iterate sequentially through the owner's Budgets, starting with the latest one.
        // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
        while (_budget.id > 0 && !_budget.hasDistributedReserves) {
            // If the budget has overflow and is redistributing, it has unminted reserved tickets.
            if (_budget._state() == Budget.State.Redistributing) {
                adminFees = adminFees.add(_budget.total.mul(fee).div(100));

                if (_budget.o > 0) {
                    // The owner gets the budget's owner percentage, if one is specified.
                    issuerTickets = issuerTickets.add(
                        _budget._weighted(_budget.total, _budget.o)
                    );
                }

                // Give to beneficiary if there is overflow.
                if (_budget.b < 0 && _budget.total > _budget.target)
                    beneficiaryDonations = beneficiaryDonations.add(
                        _budget.total.sub(_budget.target).mul(_budget.b).div(
                            100
                        )
                    );
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
      @param _dai The DAI contract.
    */
    constructor(
        IBudgetStore _budgetStore,
        ITicketStore _ticketStore,
        uint256 _fee,
        IERC20 _dai
    ) public {
        budgetStore = _budgetStore;
        ticketStore = _ticketStore;
        fee = _fee;
        dai = _dai;
    }

    /**
        @notice Issues an owner's Tickets that'll be handed out by their budgets in exchange for payments.
        @dev Deploys an owner's Ticket ERC-20 token contract.
        @param _name The ERC-20's name.
        @param _symbol The ERC-20's symbol.
    */
    function issueTickets(string calldata _name, string calldata _symbol)
        external
        override
    {
        // An owner only needs to issue their Tickets once before they can be used.
        require(
            ticketStore.tickets(msg.sender) == Tickets(0),
            "Juicer::issueTickets: ALREADY_ISSUED"
        );

        // Save the created Tickets contract in the store.
        ticketStore.saveTickets(
            msg.sender,
            // Create the contract in this Juicer contract in order to have mint and burn privileges.
            new Tickets(_name, _symbol)
        );

        emit IssueTickets(msg.sender, _name, _symbol);
    }

    /**
        @notice Configures the sustainability target and duration of the sender's current Budget if it hasn't yet received sustainments, or
        sets the properties of the Budget that will take effect once the current one expires.
        @dev The msg.sender is the owner of the budget.
        @param _target The cashflow target to set.
        @param _duration The duration to set, measured in seconds.
        @param _link A link to information about the Budget.
        @param _discountRate A number from 95-100 indicating how valuable a contribution to the current Budget is 
        compared to the owners previous Budget.
        If it's 100, each Budget will have equal weight.
        If it's 95, each Money pool will be 95% as valuable as the previous Money pool's weight.
        This is `discountRate` is realized through the amount of Ticket distributed per unit of contribution made.
        @param _o The percentage of this Budget's overflow to reserve for the owner.
        @param _b The amount of this Budget's overflow to give to a beneficiary address. 
        This can be another contract, or an end user address.
        An example would be a contract that reserves for Gitcoin grant matching.
        @param _bAddress The address of the beneficiary contract that can mint the reserved beneficiary percentage.
        @return _budgetId The ID of the Budget that was successfully configured.
    */
    function configureBudget(
        uint256 _target,
        uint256 _duration,
        string calldata _link,
        uint256 _discountRate,
        uint256 _o,
        uint256 _b,
        address _bAddress
    ) external override returns (uint256) {
        // The `discountRate` token must be between 95 and 100.
        require(
            _discountRate >= 95 && _discountRate <= 100,
            "Juicer:configureBudget: BAD_BIAS"
        );
        // If the beneficiary reserve percentage is greater than 0, an address must be provided.
        require(
            _b == 0 || _bAddress != address(0),
            "Juicer::configureBudget: BAD_ADDRESS"
        );
        // The reserved ticket percentage must add up to less than or equal to 100.
        require(_o <= 100, "Juicer::configureBudget: BAD_RESERVE_PERCENTAGES");

        // Get a reference to the owner's Tickets.
        Tickets _tickets = ticketStore.tickets(msg.sender);

        // Make sure the owner has already issued Tickets.
        require(
            _tickets != Tickets(0),
            "Juicer::configureBudget: NEEDS_INITIALIZATION"
        );

        // Return's the owner's editable budget. Creates one if one doesn't already exists.
        Budget.Data memory _budget =
            budgetStore.ensureStandbyBudget(msg.sender);

        // Set the properties of the budget.
        _budget.link = _link;
        _budget.target = _target;
        _budget.duration = _duration;
        _budget.want = dai;
        // Reset the start time to now if the owner's current Budget doesn't yet have sustainments.
        _budget.start = budgetStore.getCurrentBudget(msg.sender).total == 0
            ? block.timestamp
            : _budget.start;
        _budget.discountRate = _discountRate;
        _budget.o = _o;
        _budget.b = _b;
        _budget.bAddress = _bAddress;
        _budget.configured = block.timestamp;

        // Save the Budget in the store.
        budgetStore.saveBudget(_budget);

        emit ConfigureBudget(
            _budget.id,
            _budget.owner,
            _budget.target,
            _budget.duration,
            dai,
            _budget.link,
            _budget.discountRate,
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
        @param _beneficiary The address to transfer the newly minted Tickets to. 
        @return _budgetId The ID of the Budget that successfully received the contribution.
    */
    function payOwner(
        address _owner,
        uint256 _amount,
        address _beneficiary
    ) external override lock returns (uint256) {
        // Positive payments only.
        require(_amount > 0, "Juicer::sustainOwner: BAD_AMOUNT");

        // Find the Budget that this contribution should go towards.
        // Creates a new budget based on the owner's most recent one if there isn't currently a Budget accepting contributions.
        Budget.Data memory _budget =
            budgetStore.ensureActiveBudget(
                _owner,
                RECONFIGURATION_VOTING_PERIOD
            );

        // Add the amount to the Budget. Takes into account the admin fee.
        _budget.total = _budget.total.add(_amount).sub(
            _amount.mul(fee).div(100)
        );

        // Get the amount of overflow funds that have been contributed to the Budget after this contribution is made.
        uint256 _overflow =
            _budget.total > _budget.target
                ? _budget.total.sub(_budget.target)
                : 0;

        // If the owner is paying to their own budget and not all of the payment amount went to the Budget's overflow,
        // auto tap so the owner doesn't have to send a second transaction to tap the funds.
        if (_budget.owner == msg.sender && _amount > _overflow) {
            // Mark the amount of the contribution that didn't go towards overflow as tapped.
            _budget.tapped = _budget.tapped.add(_amount.sub(_overflow));
            // Transfer the overflow only, since the rest has been marked as tapped.
            if (_overflow > 0)
                dai.safeTransferFrom(msg.sender, address(this), _overflow);

            emit TapBudget(_budget.id, msg.sender, msg.sender, _overflow, dai);
        } else {
            // Transfer the amount from the contributor to this contract.
            dai.safeTransferFrom(msg.sender, address(this), _amount);
        }

        // Save the budget to the store.
        budgetStore.saveBudget(_budget);

        // If the Budget has overflow, give to beneficiary and add the amount of contributed funds that went to overflow to the claimable amount.
        if (_overflow > 0) {
            uint256 _contributedOverflow =
                _amount > _overflow ? _overflow : _amount;
            ticketStore.addClaimable(
                _budget.owner,
                _contributedOverflow.sub(
                    _contributedOverflow.mul(_budget.b).div(100)
                )
            );
        }

        // Mint the appropriate amount of tickets for the contributor.
        ticketStore.tickets(_budget.owner).mint(
            _beneficiary,
            _budget._weighted(_amount, uint256(100).sub(_budget.o).sub(fee))
        );

        emit SustainBudget(
            _budget.id,
            _budget.owner,
            _beneficiary,
            msg.sender,
            _amount,
            dai
        );

        return _budget.id;
    }

    /**
        @notice Addresses can redeem their Tickets to claim overflowed tokens.
        @param _issuer The issuer of the Tickets being redeemed.
        @param _amount The amount of Tickets to redeem.
        @param _minReturn The minimum amount of tokens expected in return.
        @param _beneficiary The address to send the tokens to.
        @return returnAmount The amount that the tickets were redeemed for.
    */
    function redeem(
        address _issuer,
        uint256 _amount,
        uint256 _minReturn,
        address _beneficiary
    ) external override lock returns (uint256 returnAmount) {
        // The amount of overflowed tokens claimable by the message sender from the specified issuer by redeeming the specified amount.
        // Multiply by the active proportion of the golden ratio. This incentizes HODLing tickets.
        returnAmount = ticketStore.getClaimableAmount(
            msg.sender,
            _amount,
            _issuer,
            382
        );

        // The amount being claimed must be less than the amount claimable.
        require(
            returnAmount >= _minReturn,
            "Juicer::redeem: INSUFFICIENT_FUNDS"
        );

        // Get a reference to the issuer's tickets.
        Tickets _tickets = ticketStore.tickets(_issuer);

        // Burn the redeemed tickets.
        _tickets.burn(msg.sender, _amount);

        // Subtract the claimed tokens from the total amount claimable.
        ticketStore.subtractClaimable(_issuer, returnAmount);

        // Transfer funds to the specified address.
        dai.safeTransfer(_beneficiary, returnAmount);

        emit Redeem(
            msg.sender,
            _tickets,
            _beneficiary,
            _amount,
            returnAmount,
            dai
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
        dai.safeTransfer(_beneficiary, _amount);

        // Distribute reserves if needed.
        if (!_budget.hasDistributedReserves) distributeReserves(msg.sender);

        emit TapBudget(_budgetId, msg.sender, _beneficiary, _amount, dai);
    }

    /**
      @notice Claim any funds belonging to you.
      @return amount The amount claimed.
     */
    function claim() external override lock returns (uint256 amount) {
        amount = claimable[msg.sender];

        require(amount > 0, "Juicer::claim: INSUFFICIENT_FUNDS");

        claimable[msg.sender] = claimable[msg.sender] = 0;

        // Transfer the funds to the specified address.
        dai.safeTransfer(msg.sender, amount);
    }

    /**
        @notice Allows an owner to migrate their Tickets' control to another contract.
        @dev This makes each owner's Ticket's portable.
        @dev Make sure you know what you're doing. This is a one way migration
        @param _to The contract that will gain minting and burning privileges over the Tickets.
    */
    function migrate(address _to) external override lock {
        require(
            migrationContractIsAllowed[_to],
            "Juicer:migrateTickets: BAD_DESTINATION"
        );

        // Get a reference to the owner's Tickets.
        Tickets _tickets = ticketStore.tickets(msg.sender);

        // The owner must have issued Tickets.
        require(_tickets != Tickets(0), "Juicer::migrateTickets: NOT_FOUND");

        // Give the new owner admin privileges.
        _tickets.transferOwnership(_to);

        // Move all claimable tokens for this issuer.
        uint256 _claimable = ticketStore.claimable(msg.sender);

        //TODO set allow limit.
        dai.safeTransfer(_to, _claimable);

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

    // --- public transactions --- //

    /**
        @notice Pays admin fees, donates to beneficiaries, and mints the amount of unminted tickets that are reserved for owners.
        @dev Reserves are only distributable once a Budget expires.
        @param _issuer The Tickets issuer whos Budgets are being searched for unminted reserved tickets.
    */
    function distributeReserves(address _issuer) public override {
        // Get a reference to the owner's tickets.
        Tickets _tickets = ticketStore.tickets(_issuer);

        // If the owner doesn't have tickets, throw.
        require(_tickets != Tickets(0), "Juicer::claim: NOT_FOUND");

        // Get a reference to the owner's latest Budget.
        Budget.Data memory _budget = budgetStore.getLatestBudget(_issuer);

        // Iterate sequentially through the owner's Budgets, starting with the latest one.
        // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
        while (_budget.id > 0 && !_budget.hasDistributedReserves) {
            // If the budget is redistributing, it has unminted reserved tickets.
            if (_budget._state() == Budget.State.Redistributing) {
                // Take fee
                uint256 _feeAmount = _budget.total.mul(fee).div(100);
                claimable[admin] = claimable[admin].add(_feeAmount);

                if (_budget.o > 0) {
                    // The owner gets the budget's owner percentage, if one is specified.
                    _tickets.mint(
                        _budget.owner,
                        _budget._weighted(_budget.total, _budget.o)
                    );
                }
                if (_budget.b < 0 && _budget.total > _budget.target) {
                    // Give to beneficiary
                    uint256 _bAmount =
                        _budget.total.sub(_budget.target).mul(_budget.b).div(
                            100
                        );
                    claimable[_budget.bAddress] = claimable[_budget.bAddress]
                        .add(_bAmount);
                }

                // Mark the budget as having distributed reserves.
                _budget.hasDistributedReserves = true;

                // Save the budget to the store;
                budgetStore.saveBudget(_budget);
            }

            // Continue the loop with the previous Budget.
            _budget = budgetStore.getBudget(_budget.previous);
        }
        emit DistributeReserves(msg.sender, _issuer);
    }
}
