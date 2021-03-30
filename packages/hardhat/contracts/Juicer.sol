// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/IBudgetStore.sol";
import "./interfaces/IOverflowYielder.sol";
import "./interfaces/IProjects.sol";
import "./abstract/JuiceProject.sol";

import "./TicketStore.sol";

import "./libraries/DSMath.sol";
import "./libraries/Math.sol";

/**
  @notice This contract manages all funds in the Juice ecosystem.
  @dev  1 (optional). A project project issues their Tickets at the ticket store.
        2. A project configures their first Budget at the budget store.
        3. Any address (end user or smart contract) can contribute funds to a Budget in this Juicer contract.
           In return, your contributors receive some of your project's tickets. 
           They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
              - The contributed amount. The more someone contributes, the more Tickets they'll receive.
              - The target amount of your Budget. The bigger your Budget's target amount, the fewer tickets that'll be minted for each token paid.
              - The Budget's weight, which is a number that decreases with each of your Budgets at a configured `discountRate`. 
                This rate is called a `discountRate` because it allows you to give out more Tickets to contributors to your 
                current Budget than to future budgets.
        4. You can collect any funds made to your project's Budget within its configured target.
           Any overflow will be accounted for seperately. 
        5. Your project's Ticket holders can redeem their Tickets for a share of your project's accumulated overflow along a bonding curve. 
           The bonding curve starts at 38.2%, meaning each ticket can be redeemed for 38.2% of its proportial overflow.
           For example, if there were 100 tickets circulating and 100 DAI of unclaimed overflow, 10 tickets could be redeemed for 3.82 DAI.
           The rest is left to share between the remaining ticket hodlers.
        6. You can reconfigure your Budget at any time with the approval of your Ticket holders, 
           The new configuration will go into effect once the current budget one expires.

  @dev A project can transfer its funds, along with the power to mint/burn their Tickets, from this contract to another allowed contract at any time.
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

    modifier onlyAdmin() {
        require(msg.sender == admin, "Juicer: UNAUTHORIZED");
        _;
    }

    // --- private properties --- //

    // If a particulate contract is available for projects to migrate their Tickets to.
    mapping(address => bool) private migrationContractIsAllowed;

    // --- public properties --- //

    /// @notice The admin of the contract who makes admin fees and can take fateful decisions over this contract's mechanics.
    address public override admin;

    /// @notice The projects contract.
    IProjects public immutable override projects;

    /// @notice The contract storing all Budget state variables.
    IBudgetStore public immutable override budgetStore;

    /// @notice The contract that manages the Tickets.
    ITicketStore public immutable override ticketStore;

    /// @notice The contract that puts overflow to work.
    IOverflowYielder public override overflowYielder;

    /// @notice The address of a the WETH ERC-20 token.
    IERC20 public immutable override weth;

    /// @notice The prices feeds.
    IPrices public override prices;

    /// @notice The current cumulative amount of tokens redeemable by each project's Tickets.
    mapping(uint256 => uint256) public override claimable;

    /// @notice The current cumulative amount of tokens redeemable in the system.
    uint256 public override totalClaimable = 0;

    // --- public views --- //

    /** 
      @notice Gets the total overflow that this Juicer is responsible for.
      @return overflow The amount of overflow.
    */
    function getTotalOverflow()
        public
        view
        override
        returns (uint256 overflow)
    {
        // The amount of weth available is this contract's balance plus whats in the yielde.
        overflow = weth.balanceOf(address(this));
        if (overflowYielder != IOverflowYielder(0))
            overflow.add(overflowYielder.getBalance(weth));
    }

    /** 
      @notice Gets the overflow for a specified project that this Juicer is responsible for.
      @param _projectId The ID of the project to get overflow for.
      @return overflow The amount of overflow.
    */
    function getOverflow(uint256 _projectId)
        public
        view
        override
        returns (uint256 overflow)
    {
        // The base amount that the issuer can claim, which doesn't include any yield generated.
        uint256 _claimable = claimable[_projectId];

        // Return 0 if the user has nothing to claim.
        if (_claimable == 0) return 0;

        // The overflow is the proportion of the total available to what's claimable for the project.
        overflow = Math.mulDiv(getTotalOverflow(), _claimable, totalClaimable);
    }

    /**
        @notice The amount of tokens that can be claimed by the given address.
        @param _holder The address to get an amount for.
        @param _amount The amount of Tickets being redeemed.
        Must be within the holder's balance.
        @param _projectId The ID of the project to which the Tickets to get an amount for belong.
        @param _proportion The proportion of the hodler's tickets to make claimable. Out of 1000.
        This creates an opportunity for incenvizing HODLing.
        If the specified `_holder` is the last holder, the proportion will fall back to 1000.
        @return amount The amount of tokens that can be claimed.
    */
    function getClaimableAmount(
        address _holder,
        uint256 _amount,
        uint256 _projectId,
        uint256 _proportion
    ) public view override returns (uint256) {
        // Make sure the specified amount is available.
        require(
            // Get the amount of tickets the specified holder has access to, or is owed.
            ticketStore.balanceOf(_holder, _projectId) >= _amount,
            "Juice::getClaimableAmount: INSUFFICIENT_FUNDS"
        );

        Budget.Data memory _budget = budgetStore.getCurrentBudget(_projectId);

        uint256 _reservedForTapping =
            DSMath.wdiv(
                _budget.target.sub(_budget.tappedTarget),
                prices.getETHPrice(_budget.currency)
            );

        if (_reservedForTapping >= claimable[_projectId]) return 0;

        uint256 _totalSupply = ticketStore.totalSupply(_projectId);

        if (_amount == _totalSupply)
            return claimable[_projectId].sub(_reservedForTapping);

        uint256 _available =
            Math.mulDiv(
                claimable[_projectId].sub(_reservedForTapping),
                _amount,
                _totalSupply
            );

        return
            Math.mulDiv(
                _available,
                // The amount claimable is a function of a bonding curve unless the last tickets are being redeemed.
                _proportion,
                1000
            );
    }

    // --- external transactions --- //

    /** 
      @param _projects The Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _budgetStore The BudgetStore to use which.
      @param _ticketStore The TicketStore to use which is an ERC-1155 mapping projects to ticket holders.
      @param _prices The price feed contract to use.
      @param _weth The address for WETH, which all funds are collected and dispersed in.
    */
    constructor(
        IProjects _projects,
        IBudgetStore _budgetStore,
        ITicketStore _ticketStore,
        IPrices _prices,
        IERC20 _weth
    ) {
        projects = _projects;
        budgetStore = _budgetStore;
        ticketStore = _ticketStore;
        prices = _prices;
        weth = _weth;
    }

    /**
        @notice Deploys a project. This will mint an ERC-721 into the `_owner`'s account and configure a first budget.
        @param _owner The address that will own the project.
        @param _name The project's name.
        @param _handle The project's unique handle.
        @param _logoUri The URI pointing to the project's logo.
        @param _target The amount that the project wants to receive in this funding stage. Sent as a wad.
        @param _currency The currency of the `target`. Send 0 for ETH or 1 for USD.
        @param _duration The duration of the funding stage for which the `target` amount is needed. 
        Measured in seconds.
        Send 0 for an indefinite funding stage.
        @param _link A link to information about the project and this funding stage.
        @param _discountRate A number from 900-1000 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
        If it's 1000, each funding stage will have equal weight.
        If the number is 900, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
        If the number is 0, an non-recurring funding stage will get made.
        @param _bondingCurveRate The rate from 0-1000 at which a project's Tickets can be redeemed for surplus.
        If its 500, tickets redeemed today are woth 50% of their proportional amount, meaning if there are 100 total tickets and $40 claimable, 10 tickets can be redeemed for $2.
        @param _reserved A number from 0-1000 indicating the percentage of each contribution's tickets that will be reserved for the project.
    */
    function deploy(
        address _owner,
        string memory _name,
        string memory _handle,
        string memory _logoUri,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string memory _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved
    ) external override lock {
        require(_target > 0, "Juicer::deploy: BAD_TARGET");

        // The `discountRate` token must be between 90% and 100%.
        require(
            (_discountRate >= 900 && _discountRate <= 1000) ||
                _discountRate == 0,
            "Juicer::deploy: BAD_DISCOUNT_RATE"
        );
        // The `bondingCurveRate` must be between 0 and 1000.
        require(
            _bondingCurveRate > 0 && _bondingCurveRate <= 1000,
            "Juicer::deploy BAD_BONDING_CURVE_RATE"
        );

        // The reserved project ticket percentage must be less than or equal to 100.
        require(_reserved <= 1000, "Juicer::deploy: BAD_RESERVE_PERCENTAGES");

        // Configure the project.
        Budget.Data memory _budget =
            budgetStore.configure(
                // Create the project and mint an ERC-721 for the `_owner`.
                // The identifiers for this project are not functional and done purely for branding by a project's PM.
                projects.create(_owner, _name, _handle, _logoUri, _link),
                _target,
                _currency,
                _duration,
                _discountRate,
                _bondingCurveRate,
                _reserved,
                // The first funding stage doesn't have a budget ballot,
                // which allows the owner to make the first reconfiguration without approval.
                IBudgetBallot(0)
            );

        emit Deploy(
            _budget.projectId,
            _owner,
            msg.sender,
            _name,
            _handle,
            _logoUri,
            _budget
        );
    }

    /**
        @notice Reconfigures the properties of the current funding stage if it hasn't yet received payments, or
        sets the properties of the proposed funding stage that will take effect once the current one expires.
        @dev The msg.sender must be the project of the budget.
        @param _projectId The ID of the project being reconfigured. 
        @param _target The cashflow target to set.
        @param _currency The currency of the target.
        @param _duration The duration to set for the funding stage.
        Measured in seconds.
        Send 0 for an indefinite funding stage.
        @param _discountRate A number from 900-1000 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
        If it's 1000, each funding stage will have equal weight.
        If the number is 900, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
        If the number is 0, an non-recurring funding stage will get made.
        @param _bondingCurveRate The rate from 0-1000 at which a project's Tickets can be redeemed for surplus.
        If its 500, tickets redeemed today are woth 50% of their proportional amount, meaning if there are 100 total tickets and $40 claimable, 10 tickets can be redeemed for $2.
        @param _reserved A number from 0-1000 indicating the percentage of each contribution's tickets that will be reserved for the project.
        @param _ballot The ballot to use for reconfiguration voting.
        @return _budgetId The id of the budget that was successfully configured.
    */
    function reconfigure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved,
        IBudgetBallot _ballot
    ) external override lock returns (uint256) {
        require(_target > 0, "Juicer::reconfigure: BAD_TARGET");

        // The `discountRate` token must be between 90% and 100%.
        require(
            (_discountRate >= 900 && _discountRate <= 1000) ||
                _discountRate == 0,
            "Juicer::reconfigure: BAD_DISCOUNT_RATE"
        );
        // The `bondingCurveRate` must be between 0 and 1000.
        require(
            _bondingCurveRate > 0 && _bondingCurveRate <= 1000,
            "Juicer::reconfigure BAD_BONDING_CURVE_RATE"
        );

        // The reserved project ticket percentage must be less than or equal to 100.
        require(
            _reserved <= 1000,
            "Juicer::reconfigure: BAD_RESERVE_PERCENTAGES"
        );

        // The message sender must be the project owner.
        require(
            projects.ownerOf(_projectId) == msg.sender,
            "Juicer::reconfigure: UNAUTHORIZED"
        );

        // Configure the funding stage's state.
        Budget.Data memory _budget =
            budgetStore.configure(
                _projectId,
                _target,
                _currency,
                _duration,
                _discountRate,
                _bondingCurveRate,
                _reserved,
                _ballot
            );

        emit Reconfigure(_budget.id, _budget.projectId, _budget);

        return _budget.id;
    }

    /**
        @notice Contribute funds to a project.
        @dev Mints the project's tickets proportional to the amount of the contribution.
        @dev The sender must approve this contract to transfer the specified amount of tokens.
        @param _projectId The ID of the project being contribute to.
        @param _amount Amount of the contribution in ETH. Sent as 1E18.
        @param _beneficiary The address to transfer the newly minted Tickets to. 
        @param _note A note that will be included in the published event.
        @return _budgetId The ID of the funding stage that successfully received the contribution.
    */
    function pay(
        uint256 _projectId,
        uint256 _amount,
        address _beneficiary,
        string memory _note
    ) external override lock returns (uint256) {
        // Positive payments only.
        require(_amount > 0, "Juicer::pay: BAD_AMOUNT");

        Budget.Data memory _budget = budgetStore.getCurrentBudget(_projectId);

        // The amount of ETH paid converted into the budget's currency.
        uint256 _convertedCurrencyAmount =
            DSMath.wmul(_amount, prices.getETHPrice(_budget.currency));

        // Print tickets for the beneficiary.
        ticketStore.print(
            _beneficiary,
            _projectId,
            _budget._weighted(
                _convertedCurrencyAmount,
                uint256(1000).sub(_budget.reserved)
            )
        );

        // Print tickets for the project owner if needed.
        if (_budget.reserved > 0) {
            ticketStore.print(
                projects.ownerOf(_budget.projectId),
                _projectId,
                _budget._weighted(_convertedCurrencyAmount, _budget.reserved)
            );
        }

        // Add to the claimable amount.
        claimable[_budget.projectId] = claimable[_budget.projectId].add(
            _amount
        );
        totalClaimable = totalClaimable.add(_amount);

        // Transfer the weth from the sender to this contract.
        weth.safeTransferFrom(msg.sender, address(this), _amount);

        emit Pay(
            _budget.id,
            _projectId,
            msg.sender,
            _beneficiary,
            _amount,
            _convertedCurrencyAmount,
            _budget.currency,
            _note,
            _budget.fee
        );

        return _budget.id;
    }

    /**
        @notice Addresses can redeem their Tickets to claim overflowed tokens.
        @param _projectId The ID of the project to which the Tickets being redeemed belong.
        @param _amount The amount of Tickets to redeem.
        @param _minReturnedETH The minimum amount of ETH expected in return.
        @param _beneficiary The address to send the tokens to.
        @return returnAmount The amount that the tickets were redeemed for.
    */
    function redeem(
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedETH,
        address _beneficiary
    ) external override lock returns (uint256 returnAmount) {
        require(_beneficiary != address(0), "Juicer::redeem: ZERO_ADDRESS");

        // The amount of tokens claimable by the message sender from the specified issuer by redeeming the specified amount.
        uint256 _claimable =
            getClaimableAmount(
                msg.sender,
                _amount,
                _projectId,
                budgetStore.getCurrentBudget(_projectId).bondingCurveRate
            );

        // The amount being claimed must be less than the amount claimable.
        require(
            _claimable >= _minReturnedETH,
            "Juicer::redeem: INSUFFICIENT_FUNDS"
        );

        // Withdrawn the deposited amount according to the claimable proportion.
        returnAmount = _withdrawProportion(_claimable, totalClaimable);

        // Subtract the claimed tokens from the total amount claimable.
        claimable[_projectId] = claimable[_projectId].sub(_claimable);
        totalClaimable = totalClaimable.sub(_claimable);

        // Redeem the tickets.
        ticketStore.redeem(_projectId, msg.sender, _amount);

        // Transfer funds to the specified address.
        weth.safeTransfer(_beneficiary, returnAmount);

        emit Redeem(
            msg.sender,
            _projectId,
            _beneficiary,
            _amount,
            returnAmount,
            weth
        );
    }

    /**
        @notice Tap into funds that have been contrubuted to your Budgets.
        @param _projectId The ID of the project to which the budget being tapped belongs.
        @param _amount The amount being tapped, in the budget's currency.
        @param _beneficiary The address to transfer the funds to.
        @param _minReturnedETH The minimum number of ETH that the amount should be valued at.
    */
    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _currency,
        address _beneficiary,
        uint256 _minReturnedETH
    ) external override lock {
        // Only a project owner can tap its funds.
        require(
            msg.sender == projects.ownerOf(_projectId),
            "Juicer::tap: UNAUTHORIZED"
        );

        // Get a reference to this project's current amount of overflow.
        uint256 _projectOverflow = getOverflow(_projectId);

        // Get a reference to the Budget being tapped.
        (uint256 _budgetId, uint256 _tappedAmount, uint256 _adminFeeAmount) =
            budgetStore.tap(
                _projectId,
                _amount,
                _currency,
                _projectOverflow,
                prices.getETHPrice(_currency)
            );

        // Make sure this amount is acceptable.
        require(
            _minReturnedETH <= _tappedAmount,
            "Juicer::tap: INSUFFICIENT_EXPECTED_AMOUNT"
        );

        Budget.Data memory _adminBudget =
            budgetStore.getCurrentBudget(JuiceProject(admin).projectId());

        // Subtract the amount claimable from the project.
        uint256 _subtractAmount =
            Math.mulDiv(
                claimable[_projectId],
                _tappedAmount.add(_adminFeeAmount),
                _projectOverflow
            );
        claimable[_projectId] = claimable[_projectId].sub(_subtractAmount);

        // Add to the claimable amount to the admin.
        claimable[_adminBudget.projectId] = claimable[_adminBudget.projectId]
            .add(_adminFeeAmount);
        totalClaimable = totalClaimable.sub(_subtractAmount).add(
            _adminFeeAmount
        );

        uint256 _convertedCurrencyAdminFeeAmount =
            DSMath.wmul(
                _adminFeeAmount,
                prices.getETHPrice(_adminBudget.currency)
            );

        // Print admin tickets for the tapper.
        ticketStore.print(
            msg.sender,
            _adminBudget.projectId,
            _adminBudget._weighted(
                _convertedCurrencyAdminFeeAmount,
                uint256(1000).sub(_adminBudget.reserved)
            )
        );

        // Print admin tickets for the admin if needed.
        if (_adminBudget.reserved > 0) {
            ticketStore.print(
                admin,
                _adminBudget.projectId,
                _adminBudget._weighted(
                    _convertedCurrencyAdminFeeAmount,
                    _adminBudget.reserved
                )
            );
        }

        // Withdraw what's being tapped so it can be transfered to the beneficiary.
        _withdraw(_tappedAmount);

        // Transfer the funds to the beneficiary.
        weth.safeTransfer(_beneficiary, _tappedAmount);

        emit Tap(
            _budgetId,
            _projectId,
            _beneficiary,
            msg.sender,
            _amount,
            _currency,
            _tappedAmount
        );
    }

    /**
      @notice Deposit any overflow funds that are not earning interest into the overflow yielder.
     */
    function deposit() external override lock {
        // Can't deposit if an overflow yielder has not yet been set.
        require(
            overflowYielder != IOverflowYielder(0),
            "Juicer::deposit: SETUP_NEEDED"
        );

        uint256 _depositable = weth.balanceOf(address(this));

        // There must be something depositable.
        require(_depositable > 0, "Juicer::deposit: INSUFFICIENT_FUNDS");

        // Deposit and reset what's depositable.
        overflowYielder.deposit(_depositable, weth);

        emit Deposit(_depositable, weth);
    }

    /**
        @notice Allows a project owner to migrate its funds to a new Juicer.
        @param _projectId The ID of the project being migrated.
        @param _to The Juicer contract that will gain the project's funds.
    */
    function migrate(uint256 _projectId, IJuicer _to) external override lock {
        require(
            migrationContractIsAllowed[address(_to)],
            "Juicer::migrate: BAD_DESTINATION"
        );

        require(
            projects.ownerOf(_projectId) == msg.sender,
            "Juicer::migrate: UNAUTHORIZED"
        );

        // The message sender must own a project.
        require(_projectId != 0, "Juicer::migrate: NOT_FOUND");

        uint256 _claimable = claimable[_projectId];
        // Withdrawn the deposited amount according to the claimable proportion.
        uint256 _amount = _withdrawProportion(_claimable, totalClaimable);

        claimable[_projectId] = 0;
        totalClaimable = totalClaimable.sub(_claimable);

        // Allow the new project to move funds owned by the issuer from contract.
        weth.safeApprove(address(_to), _amount);
        _to.addOverflow(_projectId, _amount, weth);

        emit Migrate(_to, _amount);
    }

    /** 
      @notice Transfer funds from the message sender to this contract that should be designated as overflow for the provided ticket issuer.
      @param _projectId The ID of the project to which the tickets getting credited with overflow belong.
      @param _amount The amount that the claimable tokens are worth.
      @param _token The token of the specified amount.
    */
    function addOverflow(
        uint256 _projectId,
        uint256 _amount,
        IERC20 _token
    ) external override lock {
        // Transfer the specified amount from the msg sender to this contract.
        // The msg sender should have already approved this transfer.
        _token.safeTransferFrom(msg.sender, address(this), _amount);

        // If there is an overflow yielder, deposit to it. Otherwise add to what's depositable.
        if (overflowYielder != IOverflowYielder(0))
            overflowYielder.deposit(_amount, weth);

        uint256 _totalOverflow = getTotalOverflow();

        // The base amount to add as claimable to the ticket store.
        uint256 _claimableToAdd =
            Math
                .mulDiv(
                totalClaimable,
                _totalOverflow.add(_amount),
                _totalOverflow
            )
                .sub(totalClaimable);

        // Add the raw claimable amount to the ticket store.
        claimable[_projectId] = claimable[_projectId].add(_claimableToAdd);
        totalClaimable = totalClaimable.add(_claimableToAdd);
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
        @notice Adds to the contract addresses that projects can migrate their Tickets to.
        @param _allowed The contract to allow.
    */
    function allowMigration(address _allowed) external override onlyAdmin {
        migrationContractIsAllowed[_allowed] = true;
        emit AddToMigrationAllowList(_allowed);
    }

    /** 
      @notice Allow the admin to change the overflow yielder. 
      @dev All funds will be migrated from the old yielder to the new one.
      @param _newOverflowYielder The new overflow yielder.
    */
    function setOverflowYielder(IOverflowYielder _newOverflowYielder)
        external
        override
        onlyAdmin
    {
        // If there is already an overflow yielder, withdraw all funds and move them to the new overflow yielder.
        if (overflowYielder != IOverflowYielder(0)) {
            _newOverflowYielder.deposit(
                overflowYielder.withdrawAll(weth),
                weth
            );
        }

        // Allow the new overflow yielder to move funds from this contract.
        weth.safeApprove(address(_newOverflowYielder), uint256(-1));
        overflowYielder = _newOverflowYielder;

        emit SetOverflowYielder(_newOverflowYielder);
    }

    // --- private transactions --- //

    /** 
      @notice Withdraws an amount from whats been deposited based on a proportion.
      @param _proportion The proportion of whats being withdrawn.
      @param _outOf The total amount that the `_proportion` is relative to.
      @return amount The amount being withdrawn.
    */
    function _withdrawProportion(uint256 _proportion, uint256 _outOf)
        private
        returns (uint256 amount)
    {
        // The amount that satisfies the proportion.
        amount = Math.mulDiv(getTotalOverflow(), _proportion, _outOf);

        _withdraw(amount);
    }

    /** 
      @notice Withdraws an amount from whats been deposited.
      @param _amount The amount being withdrawn.
    */
    function _withdraw(uint256 _amount) private {
        uint256 _depositable = weth.balanceOf(address(this));
        // Withdraw from the overflow yielder if there's nothing depositable.
        if (_depositable == 0) {
            overflowYielder.withdraw(_amount, weth);
            // Withdraw the difference between whats depositable and whats being returned, while setting depositable to 0.
        } else {
            overflowYielder.withdraw(_amount.sub(_depositable), weth);
        }
    }
}
