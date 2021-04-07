// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/IBudgetStore.sol";
import "./interfaces/IYielder.sol";
import "./interfaces/IProjects.sol";
import "./abstract/JuiceProject.sol";

import "./TicketStore.sol";

import "./libraries/DSMath.sol";
import "./libraries/ProportionMath.sol";
import "./libraries/FullMath.sol";

/**
  @notice This contract manages the Juice ecosystem, and manages the flow of funds.
  @dev  1. Deploy a project that specifies how much funds can be tapped over a set amount of time. 
           You can specify your funding target in USD or ETH.
        2. Anyone can pay your project in ETH, which gives them Tickets.
           They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
              - The contributed amount of ETH. The more someone contributes, the more Tickets they'll receive.
              - The target amount of your Budget. The bigger your Budget's target amount, the fewer tickets that'll be minted for each token paid.
              - The Budget's weight, which is a number that decreases with each of your Budgets at a configured `discountRate`. 
                This rate is called a `discountRate` because it allows you to give out more Tickets to contributors to your 
                current Budget than to future budgets.
        3. You can tap ETH up to the specified amount. 
           Any overflow can be claimed by Ticket holders by redeeming tickets, otherwise it rolls over to your next funding period.
        6. You can reconfigure your project at any time with the approval of your Ticket holders, 
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

    // The current cumulative amount of tokens redeemable by each project's Tickets.
    // NOTE: a project's balance will decrease if it leaves its processableAmount unprocessed with a high yielding yielder.
    mapping(uint256 => uint256) private processableAmount;

    // The current cumulative amount of tokens redeemable by each project's Tickets.
    mapping(uint256 => uint256) private processedAmount;

    // The current cumulative amount of tokens redeemable by each project's Tickets.
    mapping(uint256 => uint256) private distributedAmount;

    // --- public properties --- //

    /// @notice The admin of the contract who makes admin fees and can take fateful decisions over this contract's mechanics.
    address public override admin;

    /// @notice The projects contract.
    IProjects public immutable override projects;

    /// @notice The contract storing all Budget state variables.
    IBudgetStore public immutable override budgetStore;

    /// @notice The contract that manages the Tickets.
    ITicketStore public immutable override ticketStore;

    /// @notice The contract that puts idle funds to work.
    IYielder public override yielder;

    /// @notice The address of a the WETH ERC-20 token.
    IERC20 public immutable override weth;

    /// @notice The prices feeds.
    IPrices public immutable override prices;

    // --- public views --- //

    /** 
      @notice Gets the total amount of funds that this Juicer is responsible for.
      @param _includeYield If the result should include any accumulated yield.
      @return amount The balance of funds.
    */
    function balance(bool _includeYield)
        public
        view
        override
        returns (uint256 amount)
    {
        // The amount of weth available is this contract's balance plus whats in the yielde.
        amount = weth.balanceOf(address(this));
        if (yielder != IYielder(0))
            _includeYield
                ? amount.add(yielder.getTotalBalance(weth))
                : amount.add(yielder.getDelegatedBalance(weth));
    }

    /** 
      @notice Gets the balance for a specified project that this Juicer is responsible for.
      @param _projectId The ID of the project to get overflow for.
      @param _includeYield If the result should include any accumulated yield.
      @return amount The balance of funds for the project.
    */
    function balanceOf(uint256 _projectId, bool _includeYield)
        public
        view
        override
        returns (uint256)
    {
        // Get a reference to the balance.
        uint256 _balance = balance(false);

        // If there is no balance, the project must not have a balance either.
        if (_balance == 0) return 0;

        // Get a reference to the amount that is processable.
        // The balance should include this amount, while adjusting for any amount of yield.
        uint256 _processableAmount = processableAmount[_projectId];

        // If the balance is composed entirely of the processable amount, return it.
        if (_balance == _processableAmount) return _processableAmount;

        // The total balance in this contract without accounting for the processable amount.
        uint256 _adjustedBalance = _balance.sub(_processableAmount);

        // The total balance in this contract, including any generated yield, without accounting for the processable amount.
        uint256 _adjustedYieldingBalance =
            balance(true).sub(_processableAmount);

        // Make the calculation from the state without the processable amount.
        uint256 _adjustedProcessableAmount =
            _processableAmount == 0
                ? 0
                : ProportionMath.find(
                    _adjustedBalance,
                    _processableAmount,
                    _adjustedYieldingBalance
                );

        uint256 _totalAmount =
            processedAmount[_projectId].add(_adjustedProcessableAmount).sub(
                distributedAmount[_projectId]
            );

        // The overflow is the proportion of the total available to what's claimable for the project.
        return
            _includeYield
                ? FullMath.mulDiv(
                    _totalAmount,
                    _adjustedYieldingBalance,
                    _adjustedBalance
                )
                : _totalAmount;
    }

    /** 
      @notice Gets the current overflowed for a specified project that this Juicer is responsible for.
      @param _projectId The ID of the project to get overflow for.
      @return overflow The current overflow of funds for the project.
    */
    function currentOverflowOf(uint256 _projectId)
        public
        view
        override
        returns (uint256 overflow)
    {
        // Get a reference to the project's current budget.
        Budget.Data memory _budget = budgetStore.getCurrentBudget(_projectId);

        // Get a reference to the amount still tappable in the current budget.
        uint256 _tappable = _budget.target.sub(_budget.tappedTarget);

        // The amount of ETH currently reserved for the owner to tap. This amount isn't considered overflow.
        uint256 _reservedEthForTapping =
            _tappable == 0
                ? 0
                : DSMath.wdiv(_tappable, prices.getETHPrice(_budget.currency));

        // Get the current balance of the project.
        uint256 _balanceOf = balanceOf(_projectId, true);

        // Overflow is the balance of this project including any accumulated yields, minus the reserved amount.
        return
            _balanceOf < _reservedEthForTapping
                ? _balanceOf
                : _balanceOf.sub(_reservedEthForTapping);
    }

    /**
        @notice The amount of tokens that can be claimed by the given address.
        @param _holder The address to get an amount for.
        Must be within the holder's balance.
        @param _projectId The ID of the project to which the Tickets to get an amount for belong.
        @param _count The number of Tickets being redeemed.
        @return amount The amount of tokens that can be claimed.
    */
    function claimableAmount(
        address _holder,
        uint256 _projectId,
        uint256 _count
    ) public view override returns (uint256) {
        // The holder must have the specified number of the project's tickets.
        require(
            ticketStore.balanceOf(_holder, _projectId) >= _count,
            "Juice::claimableAmount: INSUFFICIENT_FUNDS"
        );

        // Get a reference to the current budget for the project.
        Budget.Data memory _budget = budgetStore.getCurrentBudget(_projectId);

        // Get the amount of current overflow.
        uint256 _currentOverflow = currentOverflowOf(_projectId);

        // If there is no overflow, nothing is claimable.
        if (_currentOverflow == 0) return 0;

        // Get the total number of tickets in circulation.
        uint256 _totalSupply = ticketStore.totalSupply(_projectId);

        // If the rest of the tickets are being used to claim, don't apply the proportion.
        if (_count == _totalSupply) return _currentOverflow;

        return
            // The proportion along the bonding curve.
            FullMath.mulDiv(
                // The proportion of held tickets compared to the total supply.
                FullMath.mulDiv(_currentOverflow, _count, _totalSupply),
                // The amount claimable is a function of a bonding curve unless the last tickets are being redeemed.
                _budget.bondingCurveRate,
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
        // Cant send tickets to the zero address.
        require(_beneficiary != address(0), "Juicer::pay: ZERO_ADDRESS");

        // Get a reference to the current budget.
        Budget.Data memory _budget = budgetStore.getCurrentBudget(_projectId);

        // Add to the processable amount for this project, which will be processed when tapped by distributing reserved tickets to this project's owner.
        processableAmount[_budget.projectId] = processableAmount[
            _budget.projectId
        ]
            .add(_amount);

        // Print tickets for the beneficiary.
        ticketStore.print(
            _beneficiary,
            _projectId,
            _budget._weighted(_amount, uint256(1000).add(_budget.reserved))
        );

        // Transfer the weth from the sender to this contract.
        weth.safeTransferFrom(msg.sender, address(this), _amount);

        emit Pay(
            _budget.id,
            _projectId,
            msg.sender,
            _beneficiary,
            _amount,
            _budget.currency,
            _note,
            _budget.fee
        );

        return _budget.id;
    }

    /**
        @notice Addresses can redeem their Tickets to claim overflowed tokens.
        @param _projectId The ID of the project to which the Tickets being redeemed belong.
        @param _count The number of Tickets to redeem.
        @param _minReturnedETH The minimum amount of ETH expected in return.
        @param _beneficiary The address to send the tokens to.
        @return amount The amount that the tickets were redeemed for.
    */
    function redeem(
        uint256 _projectId,
        uint256 _count,
        uint256 _minReturnedETH,
        address _beneficiary
    ) external override lock returns (uint256 amount) {
        // Can't send claimed funds to the zero address.
        require(_beneficiary != address(0), "Juicer::redeem: ZERO_ADDRESS");

        // The amount of ETH claimable by the message sender from the specified project by redeeming the specified number of tickets.
        amount = claimableAmount(msg.sender, _projectId, _count);

        // The amount being claimed must be at least as much as was expected.
        require(
            amount >= _minReturnedETH,
            "Juicer::redeem: INSUFFICIENT_FUNDS"
        );

        // Add to the amount that has now been distributed by the project.
        // Since the `redeemedAmount` shouldn't include any earned yield but the `amount` does, the correct proportion must be calculated.
        distributedAmount[_projectId] = distributedAmount[_projectId].add(
            FullMath.mulDiv(
                // The current balance amount with no yield considerations...
                balanceOf(_projectId, false),
                // multiplied by the ratio of the amount redeemed to the total yielding balance of the project.
                amount,
                balanceOf(_projectId, true)
            )
        );

        // Make sure the amount being claimed is in the posession of this contract and not in the yielder.
        _ensureAvailability(amount);

        // Redeem the tickets, which removes and burns them from the sender's wallet.
        ticketStore.redeem(_projectId, msg.sender, _count);

        // Transfer funds to the specified address.
        weth.safeTransfer(_beneficiary, amount);

        emit Redeem(msg.sender, _projectId, _beneficiary, _count, amount, weth);
    }

    /**
        @notice Tap into funds that have been contributed to your Budgets.
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

        // Can't tap funds to the zero address.
        require(_beneficiary != address(0), "Juicer::tap: ZERO_ADDRESS");

        // Process any processable payments to make sure all reserved tickets are distributed.
        _processPendingAmount(_projectId);

        // Get a reference to this project's current balance, included any earned yield.
        uint256 _projectBalance = balanceOf(_projectId, true);

        // Save the new state of the budget.
        (uint256 _budgetId, uint256 _tappedAmount, uint256 _adminFeeAmount) =
            budgetStore.tap(
                _projectId,
                _amount,
                _currency,
                _projectBalance,
                prices.getETHPrice(_currency)
            );

        // The amount being tapped must be at least as much as was expected.
        require(
            _minReturnedETH <= _tappedAmount,
            "Juicer::tap: INSUFFICIENT_EXPECTED_AMOUNT"
        );

        // Add to the amount that has now been distributed by the project.
        // Since the `distributedAmount` doesn't include any earned yield but the `_tappedAmount` and `_adminFeeAmount` might include earned yields, the correct proportion must be subtracted.
        distributedAmount[_projectId] = distributedAmount[_projectId].add(
            FullMath.mulDiv(
                // The current distributable amount...
                balanceOf(_projectId, false),
                // multiplied by the ratio of the amount being tapped and used as a fee to the total yielding balance of the project.
                _tappedAmount.add(_adminFeeAmount),
                _projectBalance
            )
        );

        // Get a reference to the admin's budget, which will be receiving the fee.
        Budget.Data memory _adminBudget =
            budgetStore.getCurrentBudget(JuiceProject(admin).projectId());

        // Add to the processable amount for the admin, which will eventually distribute reserved tickets to the admin's owner.
        processableAmount[_adminBudget.projectId] = processableAmount[
            _adminBudget.projectId
        ]
            .add(_adminFeeAmount);

        // Print admin tickets for the tapper.
        ticketStore.print(
            msg.sender,
            _adminBudget.projectId,
            _adminBudget._weighted(
                _adminFeeAmount,
                uint256(1000).sub(_adminBudget.reserved)
            )
        );

        // Make sure the amount being tapped is in the posession of this contract and not in the yielder.
        _ensureAvailability(_tappedAmount);

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
      @notice Deposit any overflow funds that are not earning interest into the yielder.
    */
    function depositIntoYielder() external override lock {
        // Can't deposit if an yielder has not yet been set.
        require(yielder != IYielder(0), "Juicer::deposit: SETUP_NEEDED");

        // Any ETH currently in posession of this contract can be deposited.
        uint256 _depositable = weth.balanceOf(address(this));

        // There must be something depositable.
        require(_depositable > 0, "Juicer::deposit: INSUFFICIENT_FUNDS");

        // Deposit in the yielder.
        yielder.deposit(_depositable, weth);

        emit Deposit(_depositable, weth);
    }

    /**
        @notice Allows a project owner to migrate its funds to a new Juicer.
        @param _projectId The ID of the project being migrated.
        @param _to The Juicer contract that will gain the project's funds.
    */
    function migrate(uint256 _projectId, IJuicer _to) external override lock {
        // The migration destination must be allowed.
        require(
            migrationContractIsAllowed[address(_to)],
            "Juicer::migrate: BAD_DESTINATION"
        );

        // Only the project owner can migrate its funds.
        require(
            projects.ownerOf(_projectId) == msg.sender,
            "Juicer::migrate: UNAUTHORIZED"
        );

        // Process any remaining funds if necessary.
        _processPendingAmount(_projectId);

        // Add the amount to what has now been distributed.
        distributedAmount[_projectId] = distributedAmount[_projectId].add(
            balanceOf(_projectId, false)
        );

        // Withdrawn all of the project's funds, included any earned interest.
        uint256 _amount = balanceOf(_projectId, true);

        // Make sure the necessary funds are in the posession of this contract.
        _ensureAvailability(_amount);

        // Allow the new project to move funds owned by the issuer from contract.
        weth.safeApprove(address(_to), _amount);

        // Move the funds to the new Juicer.
        _to.addToBalance(_projectId, _amount, weth);

        emit Migrate(_to, _amount);
    }

    /** 
      @notice Transfer funds from the message sender to this contract belonging to the specified project.
      @param _projectId The ID of the project to which the tickets getting credited with overflow belong.
      @param _amount The amount that the claimable tokens are worth.
      @param _token The token of the specified amount.
    */
    function addToBalance(
        uint256 _projectId,
        uint256 _amount,
        IERC20 _token
    ) external override lock {
        // Transfer the specified amount from the msg sender to this contract.
        // The msg sender should have already approved this transfer.
        _token.safeTransferFrom(msg.sender, address(this), _amount);

        // If there is an yielder, deposit to it.
        if (yielder != IYielder(0)) yielder.deposit(_amount, weth);

        // Add the processed amount.
        processedAmount[_projectId] = processedAmount[_projectId].add(
            // Calculate the amount to add to the project's processed amount, removing any influence of yield accumulated prior to adding.
            ProportionMath.find(balance(false), _amount, balance(true))
        );
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
      @notice Allow the admin to change the yielder. 
      @dev All funds will be migrated from the old yielder to the new one.
      @param _yielder The new yielder.
    */
    function setYielder(IYielder _yielder) external override onlyAdmin {
        // If there is already an yielder, withdraw all funds and move them to the new yielder.
        if (yielder != IYielder(0))
            _yielder.deposit(yielder.withdrawAll(weth), weth);

        // Allow the new yielder to move funds from this contract.
        weth.safeApprove(address(_yielder), uint256(-1));
        yielder = _yielder;

        emit SetYielder(_yielder);
    }

    // --- private transactions --- //

    /** 
      @notice Makes sure the requested amount is in the posession of this contract.
      @param _amount The amount to ensure.
    */
    function _ensureAvailability(uint256 _amount) private {
        uint256 _balance = weth.balanceOf(address(this));
        // No need to withdraw from the yielder if the current balance is greater than the amount being ensured.
        // Withdraw the amount entirely from the yielder if there's no balance, otherwise withdraw the difference between the balance and the amount being ensured.
        if (_balance > _amount)
            yielder.withdraw(
                _balance == 0 ? _amount : _amount.sub(_balance),
                weth
            );
    }

    /** 
      @notice Processes payments by making sure the project has received all reserved tickets, and updating the state variables.
      @param _projectId The ID of the project to process payments for.
    */
    function _processPendingAmount(uint256 _projectId) private {
        // Get a referrence to the amount current processable for this project.
        uint256 _processableAmount = processableAmount[_projectId];

        if (_processableAmount == 0) return;

        // Get a reference to the current budget.
        Budget.Data memory _budget = budgetStore.getCurrentBudget(_projectId);

        // Print tickets for the project owner if needed.
        if (_budget.reserved > 0) {
            ticketStore.print(
                projects.ownerOf(_projectId),
                _projectId,
                _budget._weighted(_processableAmount, _budget.reserved)
            );
        }

        // Add the processable amount to what is now distributable to tappers and redeemers for this project.
        processedAmount[_projectId] = processedAmount[_projectId].add(
            ProportionMath.find(
                balance(false),
                _processableAmount,
                balance(true)
            )
        );

        // Clear the processable amount for this project.
        processableAmount[_projectId] = 0;
    }
}
