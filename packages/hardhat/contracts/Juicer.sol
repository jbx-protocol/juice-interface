// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./abstract/JuiceProject.sol";

import "./libraries/DSMath.sol";
import "./libraries/ProportionMath.sol";
import "./libraries/FullMath.sol";

/**
  @notice This contract manages the Juice ecosystem, and manages all funds.
  @dev  1. Deploy a project that specifies how much funds can be tapped over a set amount of time. 
        2. Anyone can pay your project in ETH, which gives them your Tickets in return that can be redeemed for your project's overflowed funds.
           They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
              - The contributed amount of ETH. The more someone contributes, the more Tickets they'll receive.
              - The target amount of your funding cycle. The bigger your funding cycle's target amount, the fewer tickets that'll be minted for each ETH paid.
              - The funding cycle's weight, which is a number that decreases with subsequent funding cycle at a configured discount rate. 
                This rate is called a "discount rate" because it allows you to give out more Tickets to those who contribute to your 
                earlier funding cycles, effectively giving earlier adopters a discounted rate.
        3. You can tap ETH up to your specified denominated amount. 
           Any overflow can be claimed by Ticket holders by redeeming tickets along a bonding curve that rewards those who wait longer to redeem, 
           otherwise overflow rolls over to your future funding periods.
        6. You can reconfigure your project at any time with the approval of a ballot that you pre set.
           The new configuration will go into effect once the current funding cycle one expires.

  @dev A project can transfer its funds, along with the power to mint/burn their Tickets, from this contract to another allowed contract at any time.
*/

// ───────────────────────────────────────────────────────────────────────────────────────────
// ─────────██████──███████──██████──██████████──██████████████──██████████████──████████████████───
// ─────────██░░██──███░░██──██░░██──██░░░░░░██──██░░░░░░░░░░██──██░░░░░░░░░░██──██░░░░░░░░░░░░██───
// ─────────██░░██──███░░██──██░░██──████░░████──██░░██████████──██░░██████████──██░░████████░░██───
// ─────────██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░██──────────██░░██────██░░██───
// ─────────██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░██████████──██░░████████░░██───
// ─────────██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░░░░░░░░░██──██░░░░░░░░░░░░██───
// ─██████──██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░██████████──██░░██████░░████───
// ─██░░██──██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░██──────────██░░██──██░░██─────
// ─██░░██████░░██──███░░██████░░██──████░░████──██░░██████████──██░░██████████──██░░██──██░░██████─
// ─██░░░░░░░░░░██──███░░░░░░░░░░██──██░░░░░░██──██░░░░░░░░░░██──██░░░░░░░░░░██──██░░██──██░░░░░░██─
// ─██████████████──███████████████──██████████──██████████████──██████████████──██████──██████████─
// ───────────────────────────────────────────────────────────────────────────────────────────

contract Juicer is IJuicer {
    using SafeMath for uint256;
    using FundingCycle for FundingCycle.Data;

    // A function modifier to prevent reentrent calls.
    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "Juicer: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    // --- private properties --- //

    // Whether or not a particular contract is available for projects to migrate their funds and Tickets to.
    mapping(address => bool) private migrationContractIsAllowed;

    // The current amount of funds that have been paid to each project since the last time the project tapped its funds (or migrated to a new juicer).
    mapping(uint256 => uint256) private processableAmount;

    // The current cumulative amount of tokens that have been redeemable by each project's Tickets.
    mapping(uint256 => uint256) private processedAmount;

    // The current cumulative amount of tokens distributed to each project's Ticket holders.
    mapping(uint256 => uint256) private distributedAmount;

    // --- public properties --- //

    /// @notice The percent fee the Juice project takes from tapped amounts. Out of 1000.
    uint256 public constant override fee = 50;

    /// @notice The admin of the contract who makes admin fees and can allow new Juicer contracts to be migrated to by project owners.
    address payable public override admin;

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice The contract storing all funding cycle configurations.
    IFundingCycles public immutable override fundingCycles;

    /// @notice The contract that manages Ticket printing and redeeming.
    ITickets public immutable override tickets;

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable override operatorStore;

    /// @notice The contract that puts idle funds to work.
    IYielder public immutable override yielder;

    /// @notice The contract that stores mods for each project.
    IModStore public immutable override modStore;

    /// @notice The prices feeds.
    IPrices public immutable override prices;

    // --- public views --- //

    /** 
      @notice Gets the total amount of funds that this Juicer is responsible for.
      @return amountWithoutYield The balance of funds not including any yield.
      @return amountWithYield The balance of funds including any yield.
    */
    function balance()
        public
        view
        override
        returns (uint256 amountWithoutYield, uint256 amountWithYield)
    {
        // The amount of ETH available is this contract's balance plus whatever is in the yielder.
        uint256 _amount = address(this).balance;
        amountWithoutYield = _amount.add(yielder.deposited());
        amountWithYield = _amount.add(yielder.getCurrentBalance());
    }

    /** 
      @notice Gets the balance for a specified project that this Juicer is responsible for.
      @param _projectId The ID of the project to get the balance of.
      @return amountWithoutYield The balance of funds for the project not including any yield.
      @return amountWithYield The balance of funds for the project including any yield.
    */
    function balanceOf(uint256 _projectId)
        public
        view
        override
        returns (uint256 amountWithoutYield, uint256 amountWithYield)
    {
        // Get a reference to the balance.
        (uint256 _balanceWithoutYield, uint256 _balanceWithYield) = balance();

        // If there is no balance, the project must not have a balance either.
        if (_balanceWithoutYield == 0) return (0, 0);

        // Get a reference to the amount that is processable for this project.
        // The balance should include this amount, while adjusting for any amount of yield.
        uint256 _processableAmount = processableAmount[_projectId];

        // If the balance is composed entirely of the processable amount, return it.
        if (_balanceWithoutYield == _processableAmount)
            return (_processableAmount, _processableAmount);

        // The total balance in this contract without accounting for the processable amount.
        uint256 _adjustedBalance = _balanceWithoutYield - _processableAmount;

        // The total balance in this contract, including any generated yield, without accounting for the processable amount.
        uint256 _adjustedYieldingBalance =
            _balanceWithYield - _processableAmount;

        // Make the calculation from the state without the processable amount.
        uint256 _adjustedProcessableAmount =
            _processableAmount == 0
                ? 0
                : ProportionMath.find(
                    _adjustedBalance,
                    _processableAmount,
                    _adjustedYieldingBalance
                );

        // processed amount plus the processable amount, minus whats already been distributed.
        amountWithoutYield = processedAmount[_projectId]
            .add(_adjustedProcessableAmount)
            .sub(distributedAmount[_projectId]);

        // The overflow is the proportion of the total available to what's claimable for the project.
        amountWithYield = FullMath.mulDiv(
            amountWithoutYield,
            _adjustedYieldingBalance,
            _adjustedBalance
        );
    }

    /** 
      @notice Gets the current overflowed amount for a specified project.
      @param _projectId The ID of the project to get overflow for.
      @return overflow The current overflow of funds for the project.
    */
    function currentOverflowOf(uint256 _projectId)
        public
        view
        override
        returns (uint256 overflow)
    {
        // Get a reference to the project's current funding cycle.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.getCurrent(_projectId);

        // Get a reference to the amount still tappable in the current funding cycle.
        uint256 _limit = _fundingCycle.target.sub(_fundingCycle.tappedTarget);

        // Get the current balance of the project with yield.
        (, uint256 _balanceOfWithYield) = balanceOf(_projectId);

        // The amount of ETH currently that the owner could still tap if its available. This amount isn't considered overflow.
        uint256 _ethTapLimit =
            _limit == 0
                ? 0
                : DSMath.wdiv(
                    _limit,
                    prices.getETHPrice(_fundingCycle.currency)
                );

        // Overflow is the balance of this project including any accumulated yields, minus the reserved amount.
        return
            _balanceOfWithYield < _ethTapLimit
                ? 0
                : _balanceOfWithYield - _ethTapLimit;
    }

    /**
        @notice The amount of tokens that can be claimed by the given address.
        @dev The _account must have at least _count tickets for the specified project.
        @dev If there is a funding cycle reconfiguration ballot open for the project, the project's current bonding curve is bypassed.
        @param _account The address to get an amount for.
        @param _projectId The ID of the project to get a claimable amount for.
        @param _count The number of Tickets that would be redeemed to get the resulting amount.
        @return amount The amount of tokens that can be claimed.
    */
    function claimableAmount(
        address _account,
        uint256 _projectId,
        uint256 _count
    ) public view override returns (uint256) {
        // The holder must have the specified number of the project's tickets.
        require(
            tickets.totalBalanceOf(_account, _projectId) >= _count,
            "Juicer::claimableAmount: INSUFFICIENT_FUNDS"
        );

        // Get a reference to the current funding cycle for the project.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.getCurrent(_projectId);

        // Get the amount of current overflow.
        uint256 _currentOverflow = currentOverflowOf(_projectId);

        // If there is no overflow, nothing is claimable.
        if (_currentOverflow == 0) return 0;

        // Get the total number of tickets in circulation.
        uint256 _totalSupply = tickets.totalSupply(_projectId);

        // Get a reference to the queued funding cycle for the project.
        FundingCycle.Data memory _queuedCycle =
            fundingCycles.getQueued(_projectId);

        // The proportional amount of overflow accessible to the account.
        uint256 _baseAmount =
            FullMath.mulDiv(_currentOverflow, _count, _totalSupply);

        // Linear bonding curve if the queued cycle is pending approval according to the previous funding cycle's ballot.
        if (_queuedCycle._isConfigurationPending()) return _baseAmount;

        // The bonding curve rate is stored in bytes 9-25 of the data property after.
        uint256 _bondingCurveRate = uint16(_fundingCycle.metadata >> 8);

        // The bonding curve formula.
        // https://www.desmos.com/calculator/sp9ru6zbpk
        // where x is _count, o is _currentOverflow, s is _totalSupply, and r is _bondingCurveRate.
        return
            _baseAmount.mul(
                uint256(_bondingCurveRate)
                    .sub(
                    FullMath.mulDiv(_count, _bondingCurveRate, _totalSupply)
                )
                    .div(1000)
                    .add(_count.div(_totalSupply))
            );
    }

    // --- external transactions --- //

    /** 
      @param _projects A Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _fundingCycles A funding cycle configuration store.
      @param _tickets A contract that manages Ticket printing and redeeming.
      @param _operatorStore A contract storing operator assignments.
      @param _modStore A storage for a project's mods.
      @param _prices A price feed contract to use.
      @param _yielder A contract responsible for earning yield on idle funds.
    */
    constructor(
        IProjects _projects,
        IFundingCycles _fundingCycles,
        ITickets _tickets,
        IOperatorStore _operatorStore,
        IModStore _modStore,
        IPrices _prices,
        IYielder _yielder
    ) {
        projects = _projects;
        fundingCycles = _fundingCycles;
        tickets = _tickets;
        operatorStore = _operatorStore;
        modStore = _modStore;
        prices = _prices;
        yielder = _yielder;
    }

    /**
        @notice Deploys a project. This will mint an ERC-721 into the `_owner`'s account and configure a first funding cycle.
        @param _owner The address that will own the project.
        @param _name The project's name.
        @param _handle The project's unique handle.
        @param _logoUri The URI pointing to the project's logo.
        @param _link A link to information about the project and this funding stage.
        @param _target The amount that the project wants to receive in this funding stage. Sent as a wad.
        @param _currency The currency of the `target`. Send 0 for ETH or 1 for USD.
        @param _duration The duration of the funding stage for which the `target` amount is needed. Measured in seconds.
        @param _discountRate A number from 0-1000 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
        If it's 1000, each funding stage will have equal weight.
        If the number is 900, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
        If the number is 0, an non-recurring funding stage will get made.
        @param _metadata A struct specifying the Juicer specific params _bondingCurveRate, and _reservedRate.
        @dev _bondingCurveRate The rate from 0-1000 at which a project's Tickets can be redeemed for surplus.
        The bonding curve formula is https://www.desmos.com/calculator/sp9ru6zbpk
        where x is _count, o is _currentOverflow, s is _totalSupply, and r is _bondingCurveRate.
        @dev _reservedRate A number from 0-1000 indicating the percentage of each contribution's tickets that will be reserved for the project owner.
        @param _ballot The new ballot that will be used to approve subsequent reconfigurations.
    */
    function deploy(
        address _owner,
        string memory _name,
        string memory _handle,
        string memory _logoUri,
        string memory _link,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        FundingCycleMetadata memory _metadata,
        IFundingCycleBallot _ballot
    ) external override lock {
        // Only a msg.sender or a specified operator of level 4 or higher can deploy its project.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, 0, msg.sender) >= 4,
            "Juicer::deploy: UNAUTHORIZED"
        );

        // Configure the funding cycle.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.configure(
                // Create the project and mint an ERC-721 for the `_owner`.
                projects.create(_owner, _name, _handle, _logoUri, _link),
                _target,
                _currency,
                _duration,
                _discountRate,
                fee,
                IFundingCycleBallot(0),
                _validateAndPackFundingCycleMetadata(_metadata),
                true
            );

        // Set this contract as the controller who can print and redeem tickets on behalf of the project.
        tickets.initialize(_fundingCycle.projectId);

        emit Deploy(
            _fundingCycle.projectId,
            _owner,
            _fundingCycle.id,
            _name,
            _handle,
            _logoUri,
            _link,
            _target,
            _currency,
            _duration,
            _discountRate,
            _metadata,
            _ballot,
            msg.sender
        );
    }

    /**
        @notice Reconfigures the properties of the current funding stage if the project hasn't distributed tickets yet, or
        sets the properties of the proposed funding stage that will take effect once the current one expires.
        @param _projectId The ID of the project being reconfigured. 
        @param _target The amount that the project wants to receive in this funding stage. Sent as a wad.
        @param _currency The currency of the `target`. Send 0 for ETH or 1 for USD.
        @param _duration The duration of the funding stage for which the `target` amount is needed. Measured in seconds.
        @param _discountRate A number from 0-1000 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
        If it's 1000, each funding stage will have equal weight.
        If the number is 900, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
        If the number is 0, an non-recurring funding stage will get made.
        @param _metadata A struct specifying the Juicer specific params _bondingCurveRate, and _reservedRate.
        @dev _bondingCurveRate The rate from 0-1000 at which a project's Tickets can be redeemed for surplus.
        The bonding curve formula is https://www.desmos.com/calculator/sp9ru6zbpk
        where x is _count, o is _currentOverflow, s is _totalSupply, and r is _bondingCurveRate.
        @dev _reservedRate A number from 0-1000 indicating the percentage of each contribution's tickets that will be reserved for the project owner.
        @param _ballot The new ballot that will be used to approve subsequent reconfigurations.
        @return fundingCycleId The id of the funding cycle that was successfully configured.
    */
    function reconfigure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        FundingCycleMetadata memory _metadata,
        IFundingCycleBallot _ballot
    ) external override lock returns (uint256) {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a msg.sender or a specified operator of level 3 or higher can reconfigure its funding cycles.
        require(
            _owner == msg.sender ||
                // Allow level 3 operators.
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                3,
            "Juicer::reconfigure: UNAUTHORIZED"
        );

        // Get a reference to the amount of tickets.
        uint256 _totalTicketSupply = tickets.totalSupply(_projectId);

        // Configure the funding stage's state.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.configure(
                _projectId,
                _target,
                _currency,
                _duration,
                _discountRate,
                fee,
                _ballot,
                _validateAndPackFundingCycleMetadata(_metadata),
                // If no tickets are currently issued, the active funding cycle can be configured.
                _totalTicketSupply == 0
            );

        emit Reconfigure(
            _fundingCycle.id,
            _fundingCycle.projectId,
            _target,
            _currency,
            _duration,
            _discountRate,
            _metadata,
            _ballot,
            msg.sender
        );

        return _fundingCycle.id;
    }

    /**
        @notice Contribute ETH to a project.
        @dev Mints the project's tickets proportional to the amount of the contribution.
        @dev The msg.value is the amount of the contribution in ETH. Sent as a wad.
        @param _projectId The ID of the project being contribute to.
        @param _beneficiary The address to transfer the newly minted Tickets to. 
        @param _note A note that will be included in the published event.
        @return _fundingCycleId The ID of the funding stage that the payment was made during.
    */
    function pay(
        uint256 _projectId,
        address _beneficiary,
        string memory _note
    ) external payable override lock returns (uint256) {
        // Positive payments only.
        require(msg.value > 0, "Juicer::pay: BAD_AMOUNT");

        // Cant send tickets to the zero address.
        require(_beneficiary != address(0), "Juicer::pay: ZERO_ADDRESS");

        FundingCycle.Data memory _fundingCycle =
            _fund(_projectId, msg.value, _beneficiary);

        emit Pay(
            _fundingCycle.id,
            _projectId,
            _beneficiary,
            msg.value,
            _fundingCycle.currency,
            _note,
            _fundingCycle.fee,
            msg.sender
        );

        return _fundingCycle.id;
    }

    /**
        @notice Addresses can redeem their Tickets to claim the project's overflowed ETH.
        @param _account The account to redeem tickets for.
        @param _projectId The ID of the project to which the Tickets being redeemed belong.
        @param _count The number of Tickets to redeem.
        @param _minReturnedETH The minimum amount of ETH expected in return.
        @param _beneficiary The address to send the ETH to.
        @param _useErc20 If ERC20s are being redeemed. Otherwise the ERC1155s will be redeemed.
        @return amount The amount of ETH that the tickets were redeemed for.
    */
    function redeem(
        address _account,
        uint256 _projectId,
        uint256 _count,
        uint256 _minReturnedETH,
        address payable _beneficiary,
        bool _useErc20
    ) external override lock returns (uint256 amount) {
        // Can't send claimed funds to the zero address.
        require(_beneficiary != address(0), "Juicer::redeem: ZERO_ADDRESS");

        // Only a msg.sender or a specified operator of level 2 or greater can redeem its tickets.
        require(
            msg.sender == _account ||
                // Allow personal operators (setting projectId to 0), or operators of the specified project.
                operatorStore.operatorLevel(_account, 0, msg.sender) >= 2 ||
                operatorStore.operatorLevel(_account, _projectId, msg.sender) >=
                2,
            "Juicer::redeem: UNAUTHORIZED"
        );

        // The amount of ETH claimable by the message sender from the specified project by redeeming the specified number of tickets.
        amount = claimableAmount(msg.sender, _projectId, _count);

        // The amount being claimed must be at least as much as was expected.
        require(
            amount >= _minReturnedETH,
            "Juicer::redeem: INSUFFICIENT_FUNDS"
        );

        // Get the project's balance with and without yield.
        (uint256 _balanceOfWithoutYield, uint256 _balanceOfWithYield) =
            balanceOf(_projectId);

        // Add to the amount that has now been distributed by the project.
        // Since the distributed amount shouldn't include any earned yield but the `amount` does, the correct proportion must be calculated.
        distributedAmount[_projectId] = distributedAmount[_projectId].add(
            FullMath.mulDiv(
                // The current balance amount with no yield considerations...
                _balanceOfWithoutYield,
                // multiplied by the ratio of the amount redeemed to the total yielding balance of the project.
                amount,
                _balanceOfWithYield
            )
        );

        // Make sure the amount being claimed is in the posession of this contract and not in the yielder.
        _ensureAvailability(amount);

        // Redeem the tickets, which removes and burns them from the sender's wallet.
        tickets.redeem(_account, _projectId, _count, _useErc20);

        // Transfer funds to the specified address.
        _beneficiary.transfer(amount);

        emit Redeem(
            _account,
            _beneficiary,
            _projectId,
            msg.sender,
            _count,
            amount,
            _useErc20
        );
    }

    /**
        @notice Tap into funds that have been contributed to a project's funding cycles.
        @param _projectId The ID of the project to which the funding cycle being tapped belongs.
        @param _amount The amount being tapped, in the funding cycle's currency.
        @param _beneficiary The address to transfer the funds to.
        @param _minReturnedETH The minimum number of ETH that the amount should be valued at.
    */
    function tap(
        uint256 _projectId,
        uint256 _amount,
        address payable _beneficiary,
        uint256 _minReturnedETH
    ) external override lock {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a project owner or a specified operator of level 1 or greater can tap its funds.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                1,
            "Juicer::tap: UNAUTHORIZED"
        );

        // Can't tap funds to the zero address.
        require(_beneficiary != address(0), "Juicer::tap: ZERO_ADDRESS");

        // Process any processable payments to make sure all eligible funds are available
        // and the project owner receives its reserved tickets.
        _processPendingAmount(_projectId, _owner);

        // Get a reference to this project's current balance, included any earned yield.
        (uint256 _balanceOfWithoutYield, uint256 _balanceOfWithYield) =
            balanceOf(_projectId);

        // Save the tapped state of the funding cycle.
        (
            // The ID of the funding cycle that was tapped.
            uint256 _fundingCycleId,
            // The amount of ETH tapped.
            uint256 _tappedAmount,
            // The amount of ETH from the _tappedAmount to pay as a fee.
            uint256 _adminFeeAmount
        ) = fundingCycles.tap(_projectId, _amount, _balanceOfWithYield);

        // The amount being tapped must be at least as much as was expected.
        require(
            _minReturnedETH <= _tappedAmount,
            "Juicer::tap: INSUFFICIENT_EXPECTED_AMOUNT"
        );

        // Add to the amount that has now been distributed by the project.
        // Since the distributed amount doesn't include any earned yield but the
        // `_tappedAmount` and `_adminFeeAmount` might include earned yields,
        // the correct proportion must be calculated.
        distributedAmount[_projectId] = distributedAmount[_projectId].add(
            FullMath.mulDiv(
                // The current balance without yield...
                _balanceOfWithoutYield,
                // multiplied by the ratio of the amount being tapped and used as a fee to the total yielding balance of the project.
                _tappedAmount,
                _balanceOfWithYield
            )
        );

        // Get a reference to the admin's project ID.
        uint256 _adminProjectId = JuiceProject(admin).projectId();

        // Get a reference to the amount that will be transfered from this contract to the beneficiary.
        uint256 _transferAmount;

        // Only process an admin fee if the project being tapped is not the admin.
        if (_projectId == _adminProjectId) {
            _transferAmount = _tappedAmount;
        } else {
            // Fund the admin.
            _fund(_adminProjectId, _adminFeeAmount, _beneficiary);
            // Transfer the tapped amount minus the fees.
            _transferAmount = _tappedAmount - _adminFeeAmount;
        }

        // Make sure the amount being transfered is in the posession of this contract and not in the yielder.
        _ensureAvailability(_transferAmount);

        // Transfer funds to the project's mods, and get a reference to how much is remaining after all mods have been paid.
        uint256 _remaining = _transferToMods(_projectId, _transferAmount);

        // Transfer any remaining balance to the beneficiary.
        _beneficiary.transfer(_remaining);

        emit Tap(
            _fundingCycleId,
            _projectId,
            _beneficiary,
            _amount,
            _tappedAmount,
            _transferAmount,
            _transferAmount,
            _remaining,
            msg.sender
        );
    }

    /**
      @notice Deposit idle funds into the yielder.
      @param _amount The amount of funds to deposit.
    */
    function deposit(uint256 _amount) external override lock {
        // There must be something depositable.
        require(_amount > 0, "Juicer::deposit: BAD_AMOUNT");

        // Any ETH currently in posession of this contract can be deposited.
        require(
            _amount <= address(this).balance,
            "Juicer::deposit: INSUFFICIENT_FUNDS"
        );

        // Deposit in the yielder.
        yielder.deposit{value: _amount}();

        emit Deposit(_amount);
    }

    /**
        @notice Allows a project owner to migrate its funds to a new contract that can manage a project's funds.
        @param _projectId The ID of the project being migrated.
        @param _to The contract that will gain the project's funds.
    */
    function migrate(uint256 _projectId, IProjectFundsManager _to)
        external
        override
        lock
    {
        // The migration destination must be allowed.
        require(
            migrationContractIsAllowed[address(_to)],
            "Juicer::migrate: BAD_DESTINATION"
        );

        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner, or a delegated operator of level 5, can migrate its funds.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) ==
                5,
            "Juicer::migrate: UNAUTHORIZED"
        );

        // Process any remaining funds if necessary.
        _processPendingAmount(_projectId, _owner);

        // Get a reference to this project's current balance, included any earned yield.
        (uint256 _balanceOfWithoutYield, uint256 _balanceOfWithYield) =
            balanceOf(_projectId);

        // Add the amount to what has now been distributed.
        distributedAmount[_projectId] = distributedAmount[_projectId].add(
            _balanceOfWithoutYield
        );

        // Make sure the necessary funds are in the posession of this contract.
        _ensureAvailability(_balanceOfWithYield);

        // Move the funds to the new contract.
        _to.addToBalance{value: _balanceOfWithYield}(_projectId);

        // Transfer the power to print and redeem tickets to the new contract.
        tickets.addController(address(_to), _projectId);
        tickets.removeController(address(this), _projectId);

        emit Migrate(_projectId, _to, _balanceOfWithYield, msg.sender);
    }

    /**
        @notice Set the admin of this contract.
        @dev Can be set once. 
        @param _admin The admin to set.
    */
    function setAdmin(address payable _admin) external override {
        // An admin can't already be set.
        require(admin == address(0), "Juicer::setAdmin: ALREADY_SET");
        // The admin can't be the zero address.
        require(_admin != address(0), "Juicer::setAdmin: ZERO_ADDRESS");

        // Set the admin.
        admin = _admin;

        emit SetAdmin(_admin);
    }

    /**
        @notice Adds to the contract addresses that projects can migrate their Tickets to.
        @param _contract The contract to allow.
    */
    function allowMigration(address _contract) external override {
        // Only the admin can take this action.
        require(msg.sender == admin, "Juicer::allowMigration: UNAUTHORIZED");

        // Can't allow the zero address.
        require(
            _contract != address(0),
            "Juicer::allowMigration: ZERO_ADDRESS"
        );

        // Set the contract as allowed
        migrationContractIsAllowed[_contract] = true;

        emit AddToMigrationAllowList(_contract);
    }

    // --- public transactions --- //

    /** 
      @notice Receives funds belonging to the specified project.
      @param _projectId The ID of the project to which the funds received belong.
    */
    function addToBalance(uint256 _projectId) public payable override lock {
        // Get a reference to the balances.
        (uint256 _balanceWithoutYield, uint256 _balanceWithYield) = balance();

        // Add the processed amount.
        processedAmount[_projectId] = processedAmount[_projectId].add(
            // Calculate the amount to add to the project's processed amount, removing any influence of yield accumulated prior to adding.
            ProportionMath.find(
                _balanceWithoutYield,
                msg.value,
                _balanceWithYield
            )
        );

        emit AddToBalance(_projectId, msg.sender);
    }

    // --- private transactions --- //

    /** 
      @notice Makes sure the specified amount is in the possession of this contract.
      @param _amount The amount to ensure.
    */
    function _ensureAvailability(uint256 _amount) private {
        // Get a reference to the amount of ETH currently in this contract.
        uint256 _balance = address(this).balance;

        // No need to withdraw from the yielder if the current balance is greater than the amount being ensured.
        if (_balance >= _amount) return;

        // Withdraw the amount entirely from the yielder if there's no balance, otherwise withdraw the difference between the balance and the amount being ensured.
        yielder.withdraw(
            _balance == 0 ? _amount : _amount - _balance,
            address(this)
        );
    }

    /** 
      @notice Processes payments by making sure the project has received all reserved tickets, and updating the state variables.
      @param _projectId The ID of the project to process payments for.
      @param _owner The owner of the project.
    */
    function _processPendingAmount(uint256 _projectId, address _owner) private {
        // Get a referrence to the amount current processable for this project.
        uint256 _processableAmount = processableAmount[_projectId];

        // If nothing is processable, there's no work to do.
        if (_processableAmount == 0) return;

        // Get a reference to the current funding cycle.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.getCurrent(_projectId);

        // The reserved rate are stored in bytes 25-30 of the data property.
        uint256 _reservedRate = uint16(_fundingCycle.metadata >> 24);

        // Print tickets for the project owner if needed.
        if (_reservedRate > 0) {
            tickets.print(
                _owner,
                _projectId,
                _fundingCycle._weighted(_processableAmount, _reservedRate)
            );
        }

        // Get a reference to the balances.
        (uint256 _balanceWithoutYield, uint256 _balanceWithYield) = balance();

        // Add the processable amount to what is now distributable to tappers and redeemers for this project.
        processedAmount[_projectId] = processedAmount[_projectId].add(
            ProportionMath.find(
                _balanceWithoutYield,
                _processableAmount,
                _balanceWithYield
            )
        );

        // Clear the processable amount for this project.
        processableAmount[_projectId] = 0;
    }

    /**
      @notice Validate and pack the funding cycle metadata.
      @param _metadata The metadata to validate and pack.
      @return packed The packed uint256 of all metadata params. The first 8 bytes specify the version.
     */
    function _validateAndPackFundingCycleMetadata(
        FundingCycleMetadata memory _metadata
    ) private pure returns (uint256 packed) {
        // The bonding curve rate must be between 0 and 1000.
        require(
            _metadata.bondingCurveRate > 0 &&
                _metadata.bondingCurveRate <= 1000,
            "FundingCycles::_validateData BAD_BONDING_CURVE_RATE"
        );

        // The reserved project ticket rate must be less than or equal to 1000.
        require(
            _metadata.reservedRate <= 1000,
            "FundingCycles::_validateData: BAD_RESERVED_RATE"
        );

        // version 0 in the first 8 bytes.
        packed = uint256(0);
        // bonding curve in bytes 9-24.
        packed |= uint256(_metadata.bondingCurveRate) << 8;
        // reserved rate in bytes 25-30 bytes.
        packed |= uint256(_metadata.reservedRate) << 24;
    }

    /** 
      @notice Fund a project.
      @param _projectId The ID of the project to fund.
      @param _amount The amount to fund.
      @param _beneficiary The address to send the newly minted tickets to.
      @return fundingCycle The funding cycle that was funded.
    */
    function _fund(
        uint256 _projectId,
        uint256 _amount,
        address _beneficiary
    ) private returns (FundingCycle.Data memory fundingCycle) {
        // Get a reference to the current funding cycle for the project.
        fundingCycle = fundingCycles.getCurrent(_projectId);

        // Add to the processable amount for this project, which will be processed when tapped by distributing reserved tickets to this project's owner.
        processableAmount[_projectId] = processableAmount[_projectId].add(
            _amount
        );

        // Print admin tickets for the tapper.
        tickets.print(
            _beneficiary,
            _projectId,
            fundingCycle._weighted(
                _amount,
                // The reserved rate is stored in bytes 25-30 of the metadata property.
                1000 - uint256(uint16(fundingCycle.metadata >> 24))
            )
        );
    }

    /** 
      @notice Transfers the appropriate amounts to each of a project's mod.
      @param _projectId The ID of the project whos mods are getting paid.
      @param _totalTransferAmount The amount to base the percentages on.
      @return _remaining The amount remaining from the `_totalTransferAmount` after all mods have been paid.
    */
    function _transferToMods(uint256 _projectId, uint256 _totalTransferAmount)
        private
        returns (uint256 _remaining)
    {
        // The total amount sent to mods.
        uint256 _modsCut = 0;
        Mod[] memory _mods = modStore.allMods(_projectId);
        //Transfer between all mods.
        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // The amount to send towards mods.
            uint256 _modCut =
                _mods[_i].amount > 0
                    ? _mods[_i].amount
                    : FullMath.mulDiv(
                        _totalTransferAmount,
                        _mods[_i].percent,
                        1000
                    );

            // Transfer ETH to the mod.
            _mods[_i].beneficiary.transfer(_modCut);

            // Add the amount to the total sent to mods.
            _modsCut = _modsCut.add(_modCut);

            emit ModPayment(
                _projectId,
                _mods[_i].beneficiary,
                _mods[_i].percent,
                _totalTransferAmount,
                _modCut
            );
        }
        // The mods must not add up to over 100%.
        require(
            _modsCut <= _totalTransferAmount,
            "Juicer::_transferToMods: BAD_MODS"
        );
        _remaining = _totalTransferAmount - _modsCut;
    }

    // If funds are sent to this contract directly, fund the admin.
    receive() external payable {
        _fund(JuiceProject(admin).projectId(), msg.value, msg.sender);
    }
}
