// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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

contract Juicer is IJuicer, ReentrancyGuard {
    using SafeMath for uint256;
    using FundingCycle for FundingCycle.Data;

    modifier onlyGov() {
        require(msg.sender == governance, "Juicer: UNAUTHORIZED");
        _;
    }

    // --- private properties --- //

    // Whether or not a particular contract is available for projects to migrate their funds and Tickets to.
    mapping(address => bool) private migrationContractIsAllowed;

    // The difference between the processedTicketTracker of a project and the project's ticket's totalSupply is the amount of tickets that
    // still need to have reserves printed against them.
    mapping(uint256 => int256) private processedTicketTracker;

    // The current cumulative amount of tokens that a project has in this contract, without taking yield into account.
    mapping(uint256 => uint256) private rawBalanceOf;

    // --- public properties --- //

    /// @notice The percent fee the Juice project takes from tapped amounts. Out of 1000.
    uint256 public override fee = 50;

    /// @notice The governance of the contract who makes fees and can allow new Juicer contracts to be migrated to by project owners.
    address payable public override governance;

    /// @notice The governance of the contract who makes fees and can allow new Juicer contracts to be migrated to by project owners.
    address payable public override pendingGovernance;

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice The contract storing all funding cycle configurations.
    IFundingCycles public immutable override fundingCycles;

    /// @notice The contract that manages Ticket printing and redeeming.
    ITickets public immutable override tickets;

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable override operatorStore;

    /// @notice The contract that stores mods for each project.
    IModStore public immutable override modStore;

    /// @notice The prices feeds.
    IPrices public immutable override prices;

    /// @notice The contract that puts idle funds to work.
    IYielder public override yielder;

    /// @notice The target amount of ETH to keep in this contract instead of depositing.
    uint256 public override targetLocalETH = 1000 * (10**18);

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
        if (yielder == IYielder(0)) {
            amountWithoutYield = _amount;
            amountWithYield = _amount;
        } else {
            amountWithoutYield = _amount.add(yielder.deposited());
            amountWithYield = _amount.add(yielder.getCurrentBalance());
        }
    }

    /** 
      @notice Gets the balance for a specified project that this Juicer is responsible for.
      @param _projectId The ID of the project to get the balance of.
      @return The balance of funds for the project including any yield.
    */
    function balanceOf(uint256 _projectId)
        public
        view
        override
        returns (uint256)
    {
        // Get a reference to the balance.
        (uint256 _balanceWithoutYield, uint256 _balanceWithYield) = balance();

        // If there is no balance, the project must not have a balance either.
        if (_balanceWithoutYield == 0) return 0;

        // The overflow is the proportion of the total available to what's claimable for the project.
        return
            FullMath.mulDiv(
                rawBalanceOf[_projectId],
                _balanceWithYield,
                _balanceWithoutYield
            );
    }

    /** 
      @notice Gets the amount of reserved tickets that a project has.
      @param _projectId The ID of the project to get overflow for.
      @param _reservedRate The reserved rate to use to make the calculation.
      @return amount overflow The current overflow of funds for the project.
    */
    function reservedTicketAmount(uint256 _projectId, uint256 _reservedRate)
        public
        view
        override
        returns (uint256)
    {
        // Get a reference to the processed ticket tracker for the project.
        int256 _processedTicketTracker = processedTicketTracker[_projectId];

        // Get a reference to the amount of tickets that are unprocessed.
        uint256 _unprocessedTicketBalanceOf =
            _processedTicketTracker >= 0
                ? tickets.totalSupply(_projectId) -
                    uint256(_processedTicketTracker)
                : tickets.totalSupply(_projectId).add(
                    uint256(-_processedTicketTracker)
                );

        // If there are no unprocessed tickets, return.
        if (_unprocessedTicketBalanceOf == 0) return 0;

        return
            FullMath.mulDiv(
                _unprocessedTicketBalanceOf,
                1000,
                1000 - _reservedRate
            ) - _unprocessedTicketBalanceOf;
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
        uint256 _limit = _fundingCycle.target - _fundingCycle.tapped;

        // Get the current balance of the project with yield.
        uint256 _balanceOf = balanceOf(_projectId);

        // The amount of ETH currently that the owner could still tap if its available. This amount isn't considered overflow.
        uint256 _ethLimit =
            _limit == 0
                ? 0
                : DSMath.wdiv(
                    _limit,
                    prices.getETHPrice(_fundingCycle.currency)
                );

        // Overflow is the balance of this project including any accumulated yields, minus the reserved amount.
        return _balanceOf < _ethLimit ? 0 : _balanceOf - _ethLimit;
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
    function claimableOverflow(
        address _account,
        uint256 _projectId,
        uint256 _count
    ) public view override returns (uint256) {
        // The holder must have the specified number of the project's tickets.
        require(
            tickets.totalBalanceOf(_account, _projectId) >= _count,
            "Juicer::claimableOverflow: INSUFFICIENT_FUNDS"
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

        // Get the number of reserved tickets the project has.
        uint256 _reservedTicketAmount =
            reservedTicketAmount(
                _projectId,
                // The reserved rate is in bits 25-30 of the metadata.
                uint256(uint16(_fundingCycle.metadata >> 24))
            );

        // If there are reserved tickets, add them to the total supply.
        if (_reservedTicketAmount > 0)
            _totalSupply = _totalSupply.add(_reservedTicketAmount);

        // // Get a reference to the queued funding cycle for the project.
        FundingCycle.Data memory _queuedCycle =
            fundingCycles.getQueued(_projectId);

        // // Use the reconfiguration bonding curve if the queued cycle is pending approval according to the previous funding cycle's ballot.
        uint256 _bondingCurveRate =
            _queuedCycle._isConfigurationPending() // The reconfiguration bonding curve rate is stored in bytes 41-56 of the metadata property.
                ? uint256(uint16(_fundingCycle.metadata >> 40)) // The bonding curve rate is stored in bytes 9-25 of the data property after.
                : uint256(uint16(_fundingCycle.metadata >> 8));

        // The bonding curve formula.
        // https://www.desmos.com/calculator/sp9ru6zbpk
        // where x is _count, o is _currentOverflow, s is _totalSupply, and r is _bondingCurveRate.
        return
            FullMath.mulDiv(
                FullMath.mulDiv(_currentOverflow, _count, _totalSupply),
                _bondingCurveRate.add(
                    FullMath.mulDiv(
                        _count,
                        1000 - _bondingCurveRate,
                        _totalSupply
                    )
                ),
                1000
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
        IYielder _yielder,
        address payable _governance
    ) {
        require(
            _projects != IProjects(0) &&
                _fundingCycles != IFundingCycles(0) &&
                _tickets != ITickets(0) &&
                _operatorStore != IOperatorStore(0) &&
                _modStore != IModStore(0) &&
                _prices != IPrices(0) &&
                _governance != address(0),
            "Juicer: ZERO_ADDRESS"
        );
        projects = _projects;
        fundingCycles = _fundingCycles;
        tickets = _tickets;
        operatorStore = _operatorStore;
        modStore = _modStore;
        prices = _prices;
        yielder = _yielder;
        governance = _governance;
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
    ) external override nonReentrant {
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
                _ballot,
                _validateAndPackFundingCycleMetadata(_metadata),
                true
            );

        // Allow this contract to print and redeem tickets.
        tickets.initialize(address(this), _fundingCycle.projectId);

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
    ) external override nonReentrant returns (uint256) {
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
      @param _preferConvertedTickets Whether ERC20's should be claimed automatically if they have been issued.
        @return _fundingCycleId The ID of the funding stage that the payment was made during.
    */
    function pay(
        uint256 _projectId,
        address _beneficiary,
        string memory _note,
        bool _preferConvertedTickets
    ) external payable override returns (uint256) {
        // Positive payments only.
        require(msg.value > 0, "Juicer::pay: BAD_AMOUNT");

        // Cant send tickets to the zero address.
        require(_beneficiary != address(0), "Juicer::pay: ZERO_ADDRESS");

        // Increment the balance of the project.
        rawBalanceOf[_projectId] = rawBalanceOf[_projectId].add(msg.value);

        // Get a reference to the current funding cycle for the project.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.getCurrent(_projectId);

        // Print tickets for the beneficiary.
        tickets.print(
            _beneficiary,
            _projectId,
            _fundingCycle._weighted(
                DSMath.wmul(
                    msg.value,
                    prices.getETHPrice(_fundingCycle.currency)
                ),
                // The reserved rate is stored in bytes 25-30 of the metadata property.
                1000 - uint256(uint16(_fundingCycle.metadata >> 24))
            ),
            _preferConvertedTickets
        );

        emit Pay(
            _fundingCycle.id,
            _projectId,
            _beneficiary,
            msg.value,
            _note,
            _preferConvertedTickets,
            msg.sender
        );

        return _fundingCycle.id;
    }

    /**
        @notice Tap into funds that have been contributed to a project's funding cycles.
        @param _projectId The ID of the project to which the funding cycle being tapped belongs.
        @param _amount The amount being tapped, in the funding cycle's currency.
        @param _minReturnedETH The minimum number of ETH that the amount should be valued at.
    */
    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedETH
    ) external override nonReentrant {
        // The ID of the funding cycle that was tapped.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.tap(_projectId, _amount);

        // Get the price of ETH.
        uint256 _ethPrice = prices.getETHPrice(_fundingCycle.currency);

        // Get a reference to this project's current balance, included any earned yield.
        uint256 _balanceOf = balanceOf(_fundingCycle.projectId);

        // The amount of ETH that is being tapped.
        uint256 _tappedETHAmount = DSMath.wdiv(_amount, _ethPrice);

        // The amount being tapped must be available.
        require(
            _tappedETHAmount <= _balanceOf,
            "Juicer::_processTap: INSUFFICIENT_FUNDS"
        );

        // The amount being tapped must be at least as much as was expected.
        require(
            _minReturnedETH <= _tappedETHAmount,
            "Juicer::_processTap: INSUFFICIENT_EXPECTED_AMOUNT"
        );

        // Remove from the balance of the project.
        // Since the balance doesn't include any earned yield but the
        // `_tappedETHAmount` might include earned yields,
        // the correct proportion must be calculated.
        rawBalanceOf[_fundingCycle.projectId] =
            rawBalanceOf[_fundingCycle.projectId] -
            FullMath.mulDiv(
                // The the amount being tapped and used as a fee...
                _tappedETHAmount,
                // multiplied by the current balance without yield...
                rawBalanceOf[_fundingCycle.projectId],
                // divided by the total yielding balance of the project.
                _balanceOf
            );

        // The amount of ETH from the _tappedAmount to pay as a fee.
        uint256 _govFeeAmount =
            _tappedETHAmount -
                FullMath.mulDiv(
                    _tappedETHAmount,
                    1000,
                    uint256(_fundingCycle.fee) + 1000
                );

        // Get a reference to the project owner, which will receive the admin's tickets from paying the fee,
        // and receive any extra tapped funds not allocated to mods.
        address payable _projectOwner =
            payable(projects.ownerOf(_fundingCycle.projectId));

        // When processing the admin fee, save gas if the admin is using this juice terminal.
        if (JuiceProject(governance).juiceTerminal() == this) {
            // Get a reference to governance's Juice project ID.
            uint256 _govProjectId = JuiceProject(governance).projectId();

            // Get a reference to the current funding cycle for the project.
            FundingCycle.Data memory _govFundingCycle =
                fundingCycles.getCurrent(_govProjectId);

            // Add to the raw balance of governance's project.
            rawBalanceOf[_govProjectId] = rawBalanceOf[_govProjectId].add(
                _govFeeAmount
            );

            // Print tickets for the beneficiary.
            tickets.print(
                _projectOwner,
                _govProjectId,
                _govFundingCycle._weighted(
                    DSMath.wmul(
                        _govFeeAmount,
                        prices.getETHPrice(_govFundingCycle.currency)
                    ),
                    // The reserved rate is stored in bytes 25-30 of the metadata property.
                    1000 - uint256(uint16(_govFundingCycle.metadata >> 24))
                ),
                false
            );

            emit Pay(
                _govFundingCycle.id,
                _govProjectId,
                _projectOwner,
                _govFeeAmount,
                "Juice fee",
                false,
                msg.sender
            );
        } else {
            JuiceProject(governance).pay{value: _govFeeAmount}(
                _projectOwner,
                "Juice fee"
            );
        }

        // Transfer the tapped amount minus the fees.
        uint256 _transferAmount = _tappedETHAmount - _govFeeAmount;

        // Make sure the amount being transfered is in the posession of this contract and not in the yielder.
        _ensureAvailability(_transferAmount);

        // Get a reference to the leftover transfer amount after all mods have been paid.
        uint256 _leftoverTransferAmount = _transferAmount;

        // The total amount sent to mods.
        PaymentMod[] memory _mods =
            modStore.allPaymentMods(_fundingCycle.projectId);

        //Transfer between all mods.
        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // Get a reference to the mod being iterated on.
            PaymentMod memory _mod = _mods[_i];
            // The amount to send towards mods.
            uint256 _modCut =
                FullMath.mulDiv(_transferAmount, _mod.percent, 1000);

            // Transfer ETH to the mod.
            _mod.beneficiary.transfer(_modCut);

            // Subtract from the amount to be sent to the beneficiary.
            _leftoverTransferAmount = _leftoverTransferAmount.sub(_modCut);

            emit ModDistribution(
                _fundingCycle.id,
                _fundingCycle.projectId,
                _mod.beneficiary,
                _mod.percent,
                _modCut,
                _transferAmount
            );
        }

        // Transfer any remaining balance to the beneficiary.
        if (_leftoverTransferAmount > 0)
            _projectOwner.transfer(_leftoverTransferAmount);

        emit Tap(
            _fundingCycle.id,
            _fundingCycle.projectId,
            _projectOwner,
            _amount,
            _fundingCycle.currency,
            _transferAmount,
            _leftoverTransferAmount,
            _govFeeAmount,
            msg.sender
        );
    }

    /**
        @notice Addresses can redeem their Tickets to claim the project's overflowed ETH.
        @param _account The account to redeem tickets for.
        @param _projectId The ID of the project to which the Tickets being redeemed belong.
        @param _count The number of Tickets to redeem.
        @param _minReturnedETH The minimum amount of ETH expected in return.
        @param _beneficiary The address to send the ETH to.
        @return amount The amount of ETH that the tickets were redeemed for.
    */
    function redeem(
        address _account,
        uint256 _projectId,
        uint256 _count,
        uint256 _minReturnedETH,
        address payable _beneficiary
    ) external override nonReentrant returns (uint256 amount) {
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
        amount = claimableOverflow(_account, _projectId, _count);

        // The amount being claimed must be at least as much as was expected.
        require(
            amount >= _minReturnedETH,
            "Juicer::redeem: INSUFFICIENT_FUNDS"
        );

        // Get a reference to the balance.
        (uint256 _balanceWithoutYield, uint256 _balanceWithYield) = balance();

        // Remove from the raw balance of the project.
        // Since the raw balance shouldn't include any earned yield but the `amount` does,
        // the correct proportion must be calculated.
        rawBalanceOf[_projectId] =
            rawBalanceOf[_projectId] -
            FullMath.mulDiv(
                // The amount redeemed...
                amount,
                // multiplied by the current balance amount with no yield considerations...
                _balanceWithoutYield,
                // divded by the total yielding balance of the project.
                _balanceWithYield
            );

        // Make sure the amount being claimed is in the posession of this contract and not in the vault.
        _ensureAvailability(amount);

        // Redeem the tickets, which removes and burns them from the account's wallet.
        tickets.redeem(_account, _projectId, _count);

        // Transfer funds to the specified address.
        _beneficiary.transfer(amount);

        // Subtract from processed tickets so that the difference between whats been processed and the
        // total supply remains the same.
        // If there are at least as many processed tickets as there are tickets being redeemed,
        // the processedTicketTracker of the project will be positive. Otherwise it will be negative.
        _setProcessedTicketTracker(_projectId, _count);

        emit Redeem(
            _account,
            _beneficiary,
            _projectId,
            msg.sender,
            _count,
            amount
        );
    }

    /**
        @notice Prints all reserved tickets for a project.
        @param _projectId The ID of the project to which the reserved tickets belong.
        @return amount The amount of tickets that are being printed.
    */
    function printReservedTickets(uint256 _projectId)
        external
        override
        nonReentrant
        returns (uint256 amount)
    {
        // Get the current funding cycle to read the reserved rate from.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.getCurrent(_projectId);

        // Get a reference to the number of tickets that need to be printed.
        amount = reservedTicketAmount(
            _projectId,
            // The reserved rate is in bits 25-30 of the metadata.
            uint256(uint16(_fundingCycle.metadata >> 24))
        );

        // Get a reference to the leftover reserved ticket amount after printing for all mods.
        uint256 _leftoverTicketAmount = amount;

        // Get a reference to all ticket mods.
        TicketMod[] memory _mods = modStore.allTicketMods(_projectId);

        //Transfer between all mods.
        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // Get a reference to the mod being iterated on.
            TicketMod memory _mod = _mods[_i];

            // The amount to send towards mods.
            uint256 _modCut = FullMath.mulDiv(amount, _mod.percent, 1000);

            // Print tickets for the mod.
            tickets.print(
                _mod.beneficiary,
                _projectId,
                _modCut,
                _mod.preferConverted
            );

            // Subtract from the amount to be sent to the beneficiary.
            _leftoverTicketAmount = _leftoverTicketAmount.sub(_modCut);

            emit ModDistribution(
                _fundingCycle.id,
                _projectId,
                _mod.beneficiary,
                _mod.percent,
                _modCut,
                amount
            );
        }

        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Mint any remaining reserved tickets to the beneficiary.
        if (_leftoverTicketAmount > 0)
            tickets.print(_owner, _projectId, _leftoverTicketAmount, false);

        // Set the processed amount to be the total supply, since all tickets have now been processed.
        _setProcessedTicketTracker(_projectId, tickets.totalSupply(_projectId));

        emit PrintReserveTickets(
            _fundingCycle.id,
            _projectId,
            _owner,
            amount,
            _leftoverTicketAmount,
            msg.sender
        );
    }

    /**
      @notice Deposit idle funds into the yielder while keeping the specified cash on hand.
    */
    function deposit() external override nonReentrant {
        // There must be a yielder.
        require(yielder != IYielder(0), "Juicer::deposit: NOT_FOUND");

        // Any ETH currently in posession of this contract can be deposited.
        require(
            address(this).balance > targetLocalETH,
            "Juicer::deposit: INSUFFICIENT_FUNDS"
        );

        // Keep the target local ETH in this contract.
        uint256 _amount = address(this).balance - targetLocalETH;

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
        nonReentrant
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

        // Get a reference to this project's current balance, included any earned yield.
        uint256 _balanceOf = balanceOf(_projectId);

        // Set the balance to 0.
        rawBalanceOf[_projectId] = 0;

        // Make sure the necessary funds are in the posession of this contract.
        _ensureAvailability(_balanceOf);

        // Move the funds to the new contract.
        _to.addToBalance{value: _balanceOf}(_projectId);

        // Transfer the power to print and redeem tickets to the new contract.
        tickets.addController(address(_to), _projectId);
        tickets.removeController(address(this), _projectId);

        emit Migrate(_projectId, _to, _balanceOf, msg.sender);
    }

    /** 
      @notice Receives funds belonging to the specified project.
      @param _projectId The ID of the project to which the funds received belong.
    */
    function addToBalance(uint256 _projectId)
        external
        payable
        override
        nonReentrant
    {
        // Get a reference to the balances.
        (uint256 _balanceWithoutYield, uint256 _balanceWithYield) = balance();

        // Add the processed amount.
        rawBalanceOf[_projectId] = rawBalanceOf[_projectId].add(
            // Calculate the amount to add to the project's processed amount,
            // removing any influence of yield accumulated prior to adding.
            ProportionMath.find(
                _balanceWithoutYield,
                msg.value,
                _balanceWithYield
            )
        );

        emit AddToBalance(_projectId, msg.sender);
    }

    /**
        @notice Adds to the contract addresses that projects can migrate their Tickets to.
        @param _contract The contract to allow.
    */
    function allowMigration(address _contract) external override onlyGov {
        // Can't allow the zero address.
        require(
            _contract != address(0),
            "Juicer::allowMigration: ZERO_ADDRESS"
        );

        // Set the contract as allowed
        migrationContractIsAllowed[_contract] = true;

        emit AddToMigrationAllowList(_contract);
    }

    /** 
      @notice Sets the target amount of ETH to keep in this contract instead of depositing.
      @param _amount The new target balance amount.
    */
    function setTargetLocalETH(uint256 _amount) external override onlyGov {
        // Set the target.
        targetLocalETH = _amount;

        // Make sure the target is met.
        _ensureAvailability(_amount);

        emit SetTargetLocalETH(_amount);
    }

    /** 
      @notice Allow the admin to change the yielder. 
      @dev All funds will be migrated from the old yielder to the new one.
      @param _yielder The new yielder.
    */
    function setYielder(IYielder _yielder) external override onlyGov {
        // If there is already an yielder, withdraw all funds and move them to the new yielder.
        if (yielder != IYielder(0))
            _yielder.deposit{value: yielder.withdrawAll(address(this))}();

        // Set the yielder.
        yielder = _yielder;

        emit SetYielder(_yielder);
    }

    /** 
      @notice Allow the admin to change the fee. 
      @param _fee The new fee percent. Out of 1000.
    */
    function setFee(uint256 _fee) external override onlyGov {
        require(_fee <= 1000, "Juicer::setFee: BAD_FEE");

        // Set the fee.
        fee = _fee;

        emit SetFee(_fee);
    }

    /** 
      @notice Allows governance to transfer its privileges to another contract.
      @param _pendingGovernance The governance to transition power to. 
      This address will have to claim the responsibility in a subsequent transaction.
    */
    function appointGovernance(address payable _pendingGovernance)
        external
        override
        onlyGov
    {
        // The new governance can't be the zero address.
        require(
            _pendingGovernance != address(0),
            "Juicer::setPendingGovernance: ZERO_ADDRESS"
        );

        // Set the appointed governance as pending.
        pendingGovernance = _pendingGovernance;

        emit AppointGovernance(_pendingGovernance);
    }

    /** 
      @notice Allows contract to accept its appointment as the new governance.
    */
    function acceptGovernance() external override {
        // Only the pending governance address can accept.
        require(
            msg.sender == pendingGovernance,
            "Juicer::acceptGovernance: UNAUTHORIZED"
        );

        // Get a reference to the pending governance.
        address payable _pendingGovernance = pendingGovernance;

        // Set the govenance to the pending value.
        governance = _pendingGovernance;

        emit AcceptGovernance(_pendingGovernance);
    }

    // --- private transactions --- //

    /** 
      @notice Makes sure the specified amount is in the possession of this contract.
      @param _amount The amount to ensure.
    */
    function _ensureAvailability(uint256 _amount) private {
        // If there's no yielder, all funds are already in this contract.
        if (yielder == IYielder(0)) return;

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

        // The reconfiguration bonding curve rate must be less than or equal to 1000.
        require(
            _metadata.reconfigurationBondingCurveRate <= 1000,
            "FundingCycles::_validateData: BAD_RECONFIGURATION_BONDING_CURVE_RATE"
        );

        // version 0 in the first 8 bytes.
        packed = uint256(0);
        // bonding curve in bytes 9-24.
        packed |= uint256(_metadata.bondingCurveRate) << 8;
        // reserved rate in bytes 25-40 bytes.
        packed |= uint256(_metadata.reservedRate) << 24;
        // reconfiguration bonding curve rate in bytes 41-56 bytes.
        packed |= uint256(_metadata.reconfigurationBondingCurveRate) << 40;
    }

    /** 
      @notice Sets the signed int tracker using an unsigned int value.
      @param _projectId The ID of the project to set the tracker for.
      @param _value The value to set.
    */
    function _setProcessedTicketTracker(uint256 _projectId, uint256 _value)
        private
    {
        // Cast the total supply to an int.
        int256 _intValue = int256(_value);

        // Make sure int casting isnt overflowing.
        require(
            uint256(_intValue) == _value,
            "Juicer::_setProcessedTicketTracker: INT_LIMIT_REACHED"
        );

        processedTicketTracker[_projectId] = _intValue;
    }

    // If funds are sent to this contract directly, fund governance.
    receive() external payable {
        // Save gas if the admin is using this juice terminal.
        if (JuiceProject(governance).juiceTerminal() == this) {
            uint256 _govProjectId = JuiceProject(governance).projectId();
            // Get a reference to the current funding cycle for the project.
            FundingCycle.Data memory _govFundingCycle =
                fundingCycles.getCurrent(_govProjectId);

            // Add to the raw balance of governance's project.
            rawBalanceOf[_govProjectId] = rawBalanceOf[_govProjectId].add(
                msg.value
            );

            // Print tickets for the beneficiary.
            tickets.print(
                msg.sender,
                _govProjectId,
                _govFundingCycle._weighted(
                    DSMath.wmul(
                        msg.value,
                        prices.getETHPrice(_govFundingCycle.currency)
                    ),
                    // The reserved rate is stored in bytes 25-30 of the metadata property.
                    1000 - uint256(uint16(_govFundingCycle.metadata >> 24))
                ),
                false
            );

            emit Pay(
                _govFundingCycle.id,
                _govProjectId,
                msg.sender,
                msg.value,
                "Direct payment to Juicer",
                false,
                msg.sender
            );
        } else {
            JuiceProject(governance).pay{value: msg.value}(
                msg.sender,
                "Direct payment to Juicer"
            );
        }
    }
}
