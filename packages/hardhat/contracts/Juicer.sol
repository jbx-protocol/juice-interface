// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
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
contract Juicer is IJuicer, IERC721Receiver {
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

    /// @notice The amount of tokens that are currently depositable into the overflow yielder.
    uint256 public override depositable = 0;

    /// @notice The address of a the WETH ERC-20 token.
    IERC20 public immutable override weth;

    // --- external views --- //

    /** 
      @notice Gets the total overflow that this Juicer is responsible for.
      @return overflow The amount of overflow.
    */
    function getTotalOverflow()
        external
        view
        override
        returns (uint256 overflow)
    {
        // The amount of weth available is what's `depositable` plust whats in the yielder.
        overflow = depositable;
        if (overflowYielder != IOverflowYielder(0))
            overflow.add(overflowYielder.getBalance(weth));
    }

    /** 
      @notice Gets the overflow for a specified project that this Juicer is responsible for.
      @param _projectId The ID of the project to get overflow for.
      @return overflow The amount of overflow.
    */
    function getOverflow(uint256 _projectId)
        external
        view
        override
        returns (uint256 overflow)
    {
        // The base amount that the issuer can claim, which doesn't include any yield generated.
        uint256 _claimable = ticketStore.claimable(_projectId);

        // Return 0 if the user has nothing to claim.
        if (_claimable == 0) return 0;

        // The amount of weth available is what's `depositable` plust whats in the yielder.
        uint256 _available = depositable;
        if (overflowYielder != IOverflowYielder(0))
            _available.add(overflowYielder.getBalance(weth));

        // The overflow is the proportion of the total available to what's claimable for the project.
        overflow = Math.mulDiv(
            _available,
            _claimable,
            ticketStore.totalClaimable()
        );
    }

    // --- external transactions --- //

    /** 
      @param _projects The Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _budgetStore The BudgetStore to use which.
      @param _ticketStore The TicketStore to use which is an ERC-1155 mapping projects to ticket holders.
      @param _weth The address for WETH, which all funds are collected and dispersed in.
    */
    constructor(
        IProjects _projects,
        IBudgetStore _budgetStore,
        ITicketStore _ticketStore,
        IERC20 _weth
    ) {
        projects = _projects;
        budgetStore = _budgetStore;
        ticketStore = _ticketStore;
        weth = _weth;
    }

    /**
        @notice Deploys a project. This will mint an ERC-721 into the `_owner`'s account and configure a first budget.
        @param _owner The address that will own the project.
        @param _name The project's name.
        @param _handle The project's unique handle.
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
                projects.create(_owner, _name, _handle),
                _target,
                _currency,
                _duration,
                _link,
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
        @param _link A link to information about the project and funding stage.
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
        string memory _link,
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
                _link,
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

        // Add a payment to the stored funding stage state of both the project being paid and the admin receiving fees.
        (
            Budget.Data memory _budget,
            uint256 _convertedCurrencyAmount,
            uint256 _overflow,
            Budget.Data memory _adminBudget,
            uint256 _adminConvertedCurrencyAmount,
            uint256 _adminOverflow
        ) =
            budgetStore.payProject(
                _projectId,
                _amount,
                JuiceProject(admin).projectId()
            );

        // Print tickets for the beneficiary, the project owner, and the admin according to the project specs.
        _printTicketsFromPayment(
            _beneficiary,
            _budget,
            _convertedCurrencyAmount,
            _adminBudget,
            _adminConvertedCurrencyAmount
        );

        // Account for overflow from this operation either in the paid project, or the admin project receiving fees.
        // If both have overflow, they're dealt with together to save on gas.
        if (_overflow > 0 && _adminOverflow > 0) {
            Budget.Data[] memory _budgets = new Budget.Data[](2);
            uint256[] memory _amounts = new uint256[](2);
            _budgets[0] = _budget;
            _budgets[1] = _adminBudget;
            _amounts[0] = _overflow;
            _amounts[1] = _adminOverflow;
            _addManyOverflow(_budgets, _amounts);
        } else if (_overflow > 0) {
            _addOverflow(_budget, _overflow);
        } else if (_adminOverflow < 0) {
            _addOverflow(_adminBudget, _adminOverflow);
        }

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
        // Redeem at the ticket store. The base amount claimable for this issuer is returned.
        (uint256 _claimable, uint256 _outOf) =
            ticketStore.redeem(
                _projectId,
                msg.sender,
                _amount,
                _minReturnedETH,
                budgetStore.getCurrentBudget(_projectId).bondingCurveRate
            );

        // Withdrawn the deposited amount according to the claimable proportion.
        returnAmount = _withdraw(_claimable, _outOf);

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
        @param _budgetId The ID of the budget to tap.
        @param _projectId The ID of the project to which the budget being tapped belongs.
        @param _amount The amount being tapped.
        @param _currency The currency of the amount being tapped. Must be the currency the project is in.
        @param _beneficiary The address to transfer the funds to.
        @param _minReturnedETH The minimum number of ETH that the amount should be valued at.
    */
    function tap(
        uint256 _budgetId,
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

        // Get a reference to the Budget being tapped, the amount to tap, and any overflow that tapping creates.
        (Budget.Data memory _budget, uint256 _tappedAmount, uint256 _overflow) =
            budgetStore.tap(_budgetId, _projectId, _amount, _currency);

        // Make sure this amount is acceptable.
        require(
            _tappedAmount >= _minReturnedETH,
            "Juicer::tap: INSUFFICIENT_EXPECTED_AMOUNT"
        );

        // If theres new overflow, give to beneficiary and add the amount of contributed funds that went to overflow to the claimable amount.
        if (_overflow > 0) _addOverflow(_budget, _overflow);

        // Transfer the funds to the specified address.
        weth.safeTransfer(_beneficiary, _tappedAmount);

        emit Tap(
            _budgetId,
            _budget.projectId,
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

        // There must be something depositable.
        require(depositable > 0, "Juicer::deposit: INSUFFICIENT_FUNDS");

        // Deposit and reset what's depositable.
        overflowYielder.deposit(depositable, weth);
        depositable = 0;

        emit Deposit(depositable, weth);
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

        // Withdrawn the deposited amount according to the claimable proportion.
        uint256 _amount =
            _withdraw(
                ticketStore.clearClaimable(_projectId),
                ticketStore.totalClaimable()
            );

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

        uint256 _overflowBefore = depositable;

        // If there is an overflow yielder, deposit to it. Otherwise add to what's depositable.
        if (overflowYielder != IOverflowYielder(0)) {
            _overflowBefore = _overflowBefore.add(
                overflowYielder.getBalance(weth)
            );
            overflowYielder.deposit(_amount, weth);
        } else {
            depositable = depositable.add(_amount);
        }

        uint256 _totalClaimable = ticketStore.totalClaimable();

        // The base amount to add as claimable to the ticket store.
        uint256 _claimableToAdd =
            Math
                .mulDiv(
                _totalClaimable,
                _overflowBefore.add(_amount),
                _overflowBefore
            )
                .sub(_totalClaimable);

        // Add the raw claimable amount to the ticket store.
        ticketStore.addClaimable(_projectId, _claimableToAdd);
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
            uint256 _amount = overflowYielder.withdrawAll(weth);
            _newOverflowYielder.deposit(_amount, weth);
        }

        // Allow the new overflow yielder to move funds from this contract.
        weth.safeApprove(address(_newOverflowYielder), uint256(-1));
        overflowYielder = _newOverflowYielder;

        emit SetOverflowYielder(_newOverflowYielder);
    }

    /** 
      @notice Allows this contract to receive a project.
    */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // --- private transactions --- //

    /** 
      @notice Withdraws an amount from whats been deposited.
      @param _proportion The proportion of whats being withdrawn.
      @param _outOf The total amount that the `_proportion` is relative to.
      @return amount The amount being withdrawn.
    */
    function _withdraw(uint256 _proportion, uint256 _outOf)
        private
        returns (uint256 amount)
    {
        // The amount of weth available.
        uint256 _available = depositable;

        if (overflowYielder != IOverflowYielder(0))
            _available.add(overflowYielder.getBalance(weth));

        // The amount that satisfies the proportion.
        amount = Math.mulDiv(_available, _proportion, _outOf);

        // Subtract the depositable amount if needed.
        if (amount <= depositable) {
            depositable = depositable.sub(amount);
            // Withdraw from the overflow yielder if there's nothing depositable.
        } else if (depositable == 0) {
            overflowYielder.withdraw(amount, weth);
            // Withdraw the difference between whats depositable and whats being returned, while setting depositable to 0.
        } else {
            overflowYielder.withdraw(amount.sub(depositable), weth);
            depositable = 0;
        }
    }

    /**
      @notice Prints tickets for everyone who should get some as a result of a payment.
      @param _beneficiary The original beneficiary of the payment. Sould receive tickets from the project paid and the admin.
      @param _budget The funding stage for the project that was paid.
      @param _amount The amount that was paid to the project, in its native currency.
      @param _feeBeneficiaryBudget The funding stage for the project that received a fee.
      @param _feeBeneficiaryAmount The amount taken as a fee, in the fee beneficiary's nativecurrency.
     */
    function _printTicketsFromPayment(
        address _beneficiary,
        Budget.Data memory _budget,
        uint256 _amount,
        Budget.Data memory _feeBeneficiaryBudget,
        uint256 _feeBeneficiaryAmount
    ) private {
        // If the fee beneficiary is reserving some tickets, print them.
        if (_feeBeneficiaryBudget.reserved > 0) {
            ticketStore.print(
                admin,
                _budget.projectId,
                _feeBeneficiaryBudget._weighted(
                    _feeBeneficiaryAmount,
                    _feeBeneficiaryBudget.reserved
                )
            );
        }

        // Split the fee weighted amount in two. This will get split between the project owner and beneficiary.
        uint256 _adminPrintAmount =
            _feeBeneficiaryBudget
                ._weighted(
                _feeBeneficiaryAmount,
                uint256(1000).sub(_feeBeneficiaryBudget.reserved)
            )
                .div(2);

        // Batch prints for gas efficiency.
        uint256[] memory _projectIds = new uint256[](2);
        uint256[] memory _values = new uint256[](2);

        // The beneficary gets tickets for both the project being paid and the fee beneficiary.
        _projectIds[0] = _budget.projectId;
        _values[0] = _budget._weighted(
            _amount,
            uint256(1000).sub(_budget.reserved)
        );
        _projectIds[1] = _feeBeneficiaryBudget.projectId;
        _values[1] = _adminPrintAmount;
        ticketStore.printMany(_beneficiary, _projectIds, _values);

        // Mint the appropriate amount of tickets for the project owner that the fee is being taken from.
        // The project gets the budget's project percentage, if one is specified.
        // If there is some amount reserved, batch the printing for gas efficiency.
        if (_budget.reserved > 0) {
            // The owner gets the reserved amount of its own tickets, and the same amount as the beneficiary of the fee beneficiary's tickets.
            _values[0] = _budget._weighted(_amount, _budget.reserved);
            ticketStore.printMany(
                projects.ownerOf(_budget.projectId),
                _projectIds,
                _values
            );
        } else {
            ticketStore.print(
                projects.ownerOf(_budget.projectId),
                _feeBeneficiaryBudget.projectId,
                _adminPrintAmount
            );
        }
    }

    /** 
      @notice Batch adds overflow.
      @param _budgets The budgets to add overflow for.
      @param _amounts The amounts of overflow to add. Indexes should correspond to `_budgets`.
    */
    function _addManyOverflow(
        Budget.Data[] memory _budgets,
        uint256[] memory _amounts
    ) private {
        // The cumulative new amount that's depositable.
        uint256 _totalDepositable = 0;

        for (uint256 _i = 0; _i < _budgets.length; _i++) {
            // The portion of the overflow that is claimable by redeeming tickets.
            // This is the total minus the percent used as a fee.
            uint256 _claimablePortion =
                Math.mulDiv(
                    _amounts[_i],
                    uint256(1000).sub(_budgets[_i].fee),
                    1000
                );

            // Add to the claimable amount.
            ticketStore.addClaimable(_budgets[_i].projectId, _claimablePortion);

            // Increment the total depositable.
            _totalDepositable = _totalDepositable.add(_claimablePortion);
        }

        // The overflow can be deposited to earn yield.
        depositable = depositable.add(_totalDepositable);
    }

    /** 
      @notice Adds overflow without batching.
      @param _budget The budget to add overflow for.
      @param _amount The amount of overflow to add.
    */
    function _addOverflow(Budget.Data memory _budget, uint256 _amount) private {
        // The portion of the overflow that is claimable by redeeming tickets.
        // This is the total minus the percent used as a fee.
        uint256 _claimablePortion =
            Math.mulDiv(_amount, uint256(1000).sub(_budget.fee), 1000);

        // Add to the claimable amount.
        ticketStore.addClaimable(_budget.projectId, _claimablePortion);

        // The overflow can be deposited to earn yield.
        depositable = depositable.add(_claimablePortion);
    }
}
