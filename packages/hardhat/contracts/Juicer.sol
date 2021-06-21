// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "prb-math/contracts/PRBMathCommon.sol";
import "prb-math/contracts/PRBMathUD60x18.sol";

import "./interfaces/IJuicer.sol";
import "./abstract/JuiceProject.sol";
import "./abstract/Operatable.sol";

import "./libraries/Operations.sol";

/**
  ───────────────────────────────────────────────────────────────────────────────────────────
  ─────────██████──███████──██████──██████████──██████████████──██████████████──████████████████───
  ─────────██░░██──███░░██──██░░██──██░░░░░░██──██░░░░░░░░░░██──██░░░░░░░░░░██──██░░░░░░░░░░░░██───
  ─────────██░░██──███░░██──██░░██──████░░████──██░░██████████──██░░██████████──██░░████████░░██───
  ─────────██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░██──────────██░░██────██░░██───
  ─────────██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░██████████──██░░████████░░██───
  ─────────██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░░░░░░░░░██──██░░░░░░░░░░░░██───
  ─██████──██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░██████████──██░░██████░░████───
  ─██░░██──██░░██──███░░██──██░░██────██░░██────██░░██──────────██░░██──────────██░░██──██░░██─────
  ─██░░██████░░██──███░░██████░░██──████░░████──██░░██████████──██░░██████████──██░░██──██░░██████─
  ─██░░░░░░░░░░██──███░░░░░░░░░░██──██░░░░░░██──██░░░░░░░░░░██──██░░░░░░░░░░██──██░░██──██░░░░░░██─
  ─██████████████──███████████████──██████████──██████████████──██████████████──██████──██████████─
  ───────────────────────────────────────────────────────────────────────────────────────────

  @notice 
  This contract manages the Juice ecosystem, and manages all funds.

  @dev  
  1. Deploy a project that specifies how much funds can be tapped over a set amount of time. 
  2. Anyone can pay your project in ETH, which gives them your Tickets in return that can be redeemed for your project's overflowed funds.
     They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
        - The contributed amount of ETH. The more someone contributes, the more Tickets they'll receive.
        - The funding cycle's weight, which is a number that decreases with subsequent funding cycle at a configured discount rate. 
          This rate is called a "discount rate" because it allows you to give out more Tickets to those who contribute to your 
          earlier funding cycles, effectively giving earlier adopters a discounted rate.
  3. You can tap ETH up to your specified denominated target amount. 
     Any overflow can be claimed by Ticket holders by redeeming tickets along a bonding curve that rewards those who wait longer to redeem, 
     otherwise overflow rolls over to your future funding cycles.
  4. You can reconfigure your project at any time with the approval of a ballot that you pre set.
     The new configuration will go into effect once the current funding cycle one expires.

  @dev 
  A project can transfer its funds, along with the power to reconfigure and mint/burn their Tickets, from this contract to another allowed contract at any time.
*/
contract Juicer is Operatable, IJuicer, ITerminal, ReentrancyGuard {
    // Modifier to only allow governance to call the function.
    modifier onlyGov() {
        require(msg.sender == governance, "Juicer: UNAUTHORIZED");
        _;
    }

    // --- private stored properties --- //

    // The difference between the processed ticket tracker of a project and the project's ticket's total supply is the amount of tickets that
    // still need to have reserves printed against them.
    mapping(uint256 => int256) private _processedTicketTrackerOf;

    // --- public immutable stored properties --- //

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice The contract storing all funding cycle configurations.
    IFundingCycles public immutable override fundingCycles;

    /// @notice The contract that manages Ticket printing and redeeming.
    ITicketBooth public immutable override ticketBooth;

    /// @notice The contract that stores mods for each project.
    IModStore public immutable override modStore;

    /// @notice The prices feeds.
    IPrices public immutable override prices;

    /// @notice The direct deposit terminals.
    ITerminalDirectory public immutable override terminalDirectory;

    // --- public stored properties --- //

    /// @notice The amount of ETH that each project is responsible for.
    mapping(uint256 => uint256) public override balanceOf;

    /// @notice The amount of premined tickets each project has issued.
    mapping(uint256 => uint256) public override preminedTicketCountOf;

    /// @notice The percent fee the Juice project takes from tapped amounts. Out of 200.
    uint256 public override fee = 10;

    /// @notice The governance of the contract who makes fees and can allow new Juicer contracts to be migrated to by project owners.
    address payable public override governance;

    /// @notice The governance of the contract who makes fees and can allow new Juicer contracts to be migrated to by project owners.
    address payable public override pendingGovernance;

    // Whether or not a particular contract is available for projects to migrate their funds and Tickets to.
    mapping(ITerminal => bool) public override migrationIsAllowed;

    // --- public views --- //

    /** 
      @notice 
      Gets the amount of reserved tickets that a project has.

      @param _projectId The ID of the project to get overflow for.
      @param _reservedRate The reserved rate to use to make the calculation.

      @return amount overflow The current overflow of funds for the project.
    */
    function reservedTicketAmountOf(uint256 _projectId, uint256 _reservedRate)
        public
        view
        override
        returns (uint256)
    {
        return
            _reservedTicketAmountFrom(
                _processedTicketTrackerOf[_projectId],
                _reservedRate,
                ticketBooth.totalSupplyOf(_projectId)
            );
    }

    /** 
      @notice 
      Gets the current overflowed amount for a specified project.

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
        FundingCycle memory _fundingCycle =
            fundingCycles.getCurrentOf(_projectId);

        return _overflowFrom(_fundingCycle);
    }

    /**
        @notice 
        The amount of tokens that can be claimed by the given address.

        @dev The _account must have at least _count tickets for the specified project.
        @dev If there is a funding cycle reconfiguration ballot open for the project, the project's current bonding curve is bypassed.

        @param _account The address to get an amount for.
        @param _projectId The ID of the project to get a claimable amount for.
        @param _count The number of Tickets that would be redeemed to get the resulting amount.

        @return amount The amount of tokens that can be claimed.
    */
    function claimableOverflowOf(
        address _account,
        uint256 _projectId,
        uint256 _count
    ) public view override returns (uint256) {
        // The holder must have the specified number of the project's tickets.
        require(
            ticketBooth.balanceOf(_account, _projectId) >= _count,
            "Juicer::claimableOverflow: INSUFFICIENT_FUNDS"
        );

        // Get a reference to the current funding cycle for the project.
        FundingCycle memory _fundingCycle =
            fundingCycles.getCurrentOf(_projectId);

        // Get the amount of current overflow.
        uint256 _currentOverflow = _overflowFrom(_fundingCycle);

        // If there is no overflow, nothing is claimable.
        if (_currentOverflow == 0) return 0;

        // Get the total number of tickets in circulation.
        uint256 _totalSupply = ticketBooth.totalSupplyOf(_projectId);

        // Get the number of reserved tickets the project has.
        uint256 _reservedTicketAmount =
            _reservedTicketAmountFrom(
                _processedTicketTrackerOf[_projectId],
                // The reserved rate is in bits 9-24 of the metadata.
                uint256(uint8(_fundingCycle.metadata >> 8)),
                _totalSupply
            );

        // If there are reserved tickets, add them to the total supply.
        if (_reservedTicketAmount > 0)
            _totalSupply = _totalSupply + _reservedTicketAmount;

        // Get a reference to the base proportion.
        uint256 _base =
            PRBMathCommon.mulDiv(_currentOverflow, _count, _totalSupply);

        // If there funding cycle isn't recurring return the base proportion.
        if (_fundingCycle.discountRate == 0) return _base;

        // Use the reconfiguration bonding curve if the queued cycle is pending approval according to the previous funding cycle's ballot.
        uint256 _bondingCurveRate =
            fundingCycles.currentBallotStateOf(_projectId) == BallotState.Active // The reconfiguration bonding curve rate is stored in bytes 41-56 of the metadata property.
                ? uint256(uint8(_fundingCycle.metadata >> 24)) // The bonding curve rate is stored in bytes 25-40 of the data property after.
                : uint256(uint8(_fundingCycle.metadata >> 16));

        // The bonding curve formula.
        // https://www.desmos.com/calculator/sp9ru6zbpk
        // where x is _count, o is _currentOverflow, s is _totalSupply, and r is _bondingCurveRate.
        return
            PRBMathCommon.mulDiv(
                _base,
                _bondingCurveRate +
                    PRBMathCommon.mulDiv(
                        _count,
                        200 - _bondingCurveRate,
                        _totalSupply
                    ),
                200
            );
    }

    // --- external transactions --- //

    /** 
      @param _projects A Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _fundingCycles A funding cycle configuration store.
      @param _ticketBooth A contract that manages Ticket printing and redeeming.
      @param _modStore A storage for a project's mods.
      @param _prices A price feed contract to use.
      @param _terminalDirectory A directory of a project's current Juice terminal to receive payments in.
    */
    constructor(
        IProjects _projects,
        IFundingCycles _fundingCycles,
        ITicketBooth _ticketBooth,
        IOperatorStore _operatorStore,
        IModStore _modStore,
        IPrices _prices,
        ITerminalDirectory _terminalDirectory,
        address payable _governance
    ) Operatable(_operatorStore) {
        require(
            _projects != IProjects(address(0)) &&
                _fundingCycles != IFundingCycles(address(0)) &&
                _ticketBooth != ITicketBooth(address(0)) &&
                _modStore != IModStore(address(0)) &&
                _prices != IPrices(address(0)) &&
                _terminalDirectory != ITerminalDirectory(address(0)) &&
                _governance != address(address(0)),
            "Juicer: ZERO_ADDRESS"
        );
        projects = _projects;
        fundingCycles = _fundingCycles;
        ticketBooth = _ticketBooth;
        modStore = _modStore;
        prices = _prices;
        terminalDirectory = _terminalDirectory;
        governance = _governance;
    }

    /**
        @notice 
        Deploys a project. This will mint an ERC-721 into the `_owner`'s account and configure a first funding cycle.

        @param _owner The address that will own the project.
        @param _handle The project's unique handle.
        @param _uri A link to information about the project and this funding stage. Must return a JSON file with properties `name`, `logoUri`, and `infoUri`.
        @param _properties The funding cycle configuration.
          @dev _properties.target The amount that the project wants to receive in this funding stage. Sent as a wad.
          @dev _properties.currency The currency of the `target`. Send 0 for ETH or 1 for USD.
          @dev _properties.duration The duration of the funding stage for which the `target` amount is needed. Measured in seconds.
          @dev _properties.discountRate A number from 0-200 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
            If it's 200, each funding stage will have equal weight.
            If the number is 180, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
            If the number is 0, an non-recurring funding stage will get made.
          @dev _configuration.ballot The new ballot that will be used to approve subsequent reconfigurations.
        @param _metadata A struct specifying the Juicer specific params _bondingCurveRate, and _reservedRate.
          @dev _reservedRate A number from 0-200 indicating the percentage of each contribution's tickets that will be reserved for the project owner.
          @dev _bondingCurveRate The rate from 0-200 at which a project's Tickets can be redeemed for surplus.
            The bonding curve formula is https://www.desmos.com/calculator/sp9ru6zbpk
            where x is _count, o is _currentOverflow, s is _totalSupply, and r is _bondingCurveRate.
          @dev _reconfigurationBondingCurveRate The bonding curve rate to apply when there is an active ballot.
        @param _paymentMods Any payment mods to set.
        @param _ticketMods Any ticket mods to set.
    */
    function deploy(
        address _owner,
        bytes32 _handle,
        string calldata _uri,
        FundingCycleProperties calldata _properties,
        FundingCycleMetadata calldata _metadata,
        PaymentMod[] memory _paymentMods,
        TicketMod[] memory _ticketMods
    ) external override {
        // Create the project for the owner.
        uint256 _projectId = projects.create(_owner, _handle, _uri);

        // Set this Juicer as the project's current terminal in the directory.
        // Must do this before the call to configure.
        terminalDirectory.setTerminal(_projectId, this);

        // Make sure the metadata checks out. If it does, return a packed version of it.
        uint256 _packedMetadata =
            _validateAndPackFundingCycleMetadata(_metadata);

        // Configure the funding stage's state.
        FundingCycle memory _fundingCycle =
            fundingCycles.configure(
                _projectId,
                _properties,
                _packedMetadata,
                fee,
                true
            );

        // Set payment mods if there are any.
        if (_paymentMods.length > 0)
            modStore.setPaymentMods(
                _projectId,
                _fundingCycle.configured,
                _paymentMods
            );

        // Set ticket mods if there are any.
        if (_ticketMods.length > 0)
            modStore.setTicketMods(
                _projectId,
                _fundingCycle.configured,
                _ticketMods
            );
    }

    /**
        @notice 
        Configures the properties of the current funding stage if the project hasn't distributed tickets yet, or
        sets the properties of the proposed funding stage that will take effect once the current one expires
        if it is approved by the current funding cycle's ballot.

        @param _projectId The ID of the project being reconfigured. 
        @param _properties The funding cycle configuration.
          @dev _properties.target The amount that the project wants to receive in this funding stage. Sent as a wad.
          @dev _properties.currency The currency of the `target`. Send 0 for ETH or 1 for USD.
          @dev _properties.duration The duration of the funding stage for which the `target` amount is needed. Measured in seconds.
          @dev _properties.discountRate A number from 0-200 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
            If it's 200, each funding stage will have equal weight.
            If the number is 180, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
            If the number is 0, an non-recurring funding stage will get made.
          @dev _properties.ballot The new ballot that will be used to approve subsequent reconfigurations.
        @param _metadata A struct specifying the Juicer specific params _bondingCurveRate, and _reservedRate.
          @dev _metadata.bondingCurveRate The rate from 0-200 at which a project's Tickets can be redeemed for surplus.
            The bonding curve formula is https://www.desmos.com/calculator/sp9ru6zbpk
            where x is _count, o is _currentOverflow, s is _totalSupply, and r is _bondingCurveRate.
          @dev _metadata.reservedRate A number from 0-200 indicating the percentage of each contribution's tickets that will be reserved for the project owner.
          @dev _metadata.bondingCurveRate The rate from 0-200 at which a project's Tickets can be redeemed for surplus.
          @dev _metadata.reconfigurationBondingCurveRate The bonding curve rate to apply when there is an active ballot.

        @return fundingCycleId The id of the funding cycle that was successfully configured.
    */
    function configure(
        uint256 _projectId,
        FundingCycleProperties calldata _properties,
        FundingCycleMetadata calldata _metadata,
        PaymentMod[] memory _paymentMods,
        TicketMod[] memory _ticketMods
    )
        external
        override
        requirePermission(
            projects.ownerOf(_projectId),
            _projectId,
            Operations.Configure
        )
        returns (uint256 fundingCycleId)
    {
        // Make sure the metadata is validated, and pack it into a uint256.
        uint256 _packedMetadata =
            _validateAndPackFundingCycleMetadata(_metadata);

        // Set the terminal if needed.
        // Must do this before the call to configure.
        if (terminalDirectory.terminalOf(_projectId) == ITerminal(address(0)))
            terminalDirectory.setTerminal(_projectId, this);

        // If the project doesn't have a balance, configure the active funding cycle instead of creating a standby one.
        bool _shouldConfigureActive = balanceOf[_projectId] == 0;

        // Configure the funding stage's state.
        FundingCycle memory _fundingCycle =
            fundingCycles.configure(
                _projectId,
                _properties,
                _packedMetadata,
                fee,
                _shouldConfigureActive
            );

        // Set payment mods for the new configuration if there are any.
        if (_paymentMods.length > 0)
            modStore.setPaymentMods(
                _projectId,
                _fundingCycle.configured,
                _paymentMods
            );

        // Set payment mods for the new configuration if there are any.
        if (_ticketMods.length > 0)
            modStore.setTicketMods(
                _projectId,
                _fundingCycle.configured,
                _ticketMods
            );

        return _fundingCycle.id;
    }

    /** 
      @notice 
      Allows a project to print tickets for a specified beneficiary.

      @dev 
      This can only be done if the project hasn't yet received a payment.

      @param _projectId The ID of the project to premine tickets for.
      @param _amount The amount to base the ticket premine off of. Measured in ETH.
      @param _beneficiary The address to send the printed tickets to.
      @param _memo A memo to leave with the printing.
      @param _preferUnstakedTickets If there is a preference to unstake the printed tickets.
    */
    function printTickets(
        uint256 _projectId,
        uint256 _amount,
        address _beneficiary,
        string memory _memo,
        bool _preferUnstakedTickets
    )
        external
        override
        nonReentrant
        requirePermission(
            projects.ownerOf(_projectId),
            _projectId,
            Operations.PrintTickets
        )
    {
        // Make sure the project hasnt printed tickets that werent premined.
        require(
            ticketBooth.totalSupplyOf(_projectId) ==
                preminedTicketCountOf[_projectId] &&
                // The only case when processedTicketTracker is 0 is before redeeming and printing reserved tickets.
                _processedTicketTrackerOf[_projectId] == 0,
            "Juicer::printTickets: ALREADY_ACTIVE"
        );

        // Can't send to the zero address.
        require(
            _beneficiary != address(0),
            "Juicer::printTickets: ZERO_ADDRESS"
        );

        // Get the current funding cycle to read the weight and currency from.
        FundingCycle memory _fundingCycle =
            fundingCycles.getCurrentOf(_projectId);

        // Multiply the amount by the funding cycle's weight to determine the amount of tickets to print.
        uint256 _weightedAmount =
            PRBMathUD60x18.mul(_amount, _fundingCycle.weight);

        // Set the count of premined tickets this project has printed.
        preminedTicketCountOf[_projectId] =
            preminedTicketCountOf[_projectId] +
            _weightedAmount;

        // Print the project's tickets for the beneficiary.
        ticketBooth.print(
            _beneficiary,
            _projectId,
            _weightedAmount,
            _preferUnstakedTickets
        );

        emit PrintTickets(_projectId, _beneficiary, _amount, _memo, msg.sender);
    }

    /**
        @notice 
        Contribute ETH to a project.

        @dev Mints the project's tickets proportional to the amount of the contribution.
        @dev The msg.value is the amount of the contribution in wei.

        @param _projectId The ID of the project being contribute to.
        @param _beneficiary The address to print Tickets for. 
        @param _memo A memo that will be included in the published event.
        @param _preferUnstakedTickets Whether ERC20's should be unstaked automatically if they have been issued.

        @return _fundingCycleId The ID of the funding cycle that the payment was made during.
    */
    function pay(
        uint256 _projectId,
        address _beneficiary,
        string calldata _memo,
        bool _preferUnstakedTickets
    ) external payable override returns (uint256) {
        // Positive payments only.
        require(msg.value > 0, "Juicer::pay: BAD_AMOUNT");

        // Cant send tickets to the zero address.
        require(_beneficiary != address(0), "Juicer::pay: ZERO_ADDRESS");

        return
            _pay(
                _projectId,
                msg.value,
                _beneficiary,
                _memo,
                _preferUnstakedTickets
            );
    }

    /**
        @notice 
        Tap into funds that have been contributed to a project's current funding cycle.

        @param _projectId The ID of the project to which the funding cycle being tapped belongs.
        @param _amount The amount being tapped, in the funding cycle's currency.
        @param _currency The expected currency being tapped.
        @param _minReturnedWei The minimum number of wei that the amount should be valued at.
    */
    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _currency,
        uint256 _minReturnedWei
    ) external override nonReentrant {
        // The ID of the funding cycle that was tapped.
        FundingCycle memory _fundingCycle =
            fundingCycles.tap(_projectId, _amount);

        // Make sure the currency's match.
        require(
            _currency == _fundingCycle.currency,
            "Juicer::tap: UNEXPECTED_CURRENCY"
        );

        // Get a reference to this project's current balance, including any earned yield.
        uint256 _balanceOf = balanceOf[_fundingCycle.projectId];

        // Get the currency price of ETH.
        uint256 _ethPrice = prices.getETHPriceFor(_fundingCycle.currency);

        // Get the price of ETH.
        // The amount of ETH that is being tapped.
        uint256 _tappedWeiAmount = PRBMathUD60x18.div(_amount, _ethPrice);

        // The amount being tapped must be available.
        require(
            _tappedWeiAmount <= _balanceOf,
            "Juicer::tap: INSUFFICIENT_FUNDS"
        );

        // The amount being tapped must be at least as much as was expected.
        require(_minReturnedWei <= _tappedWeiAmount, "Juicer::tap: INADEQUATE");

        // Removed the tapped funds from the project's balance.
        balanceOf[_projectId] = _balanceOf - _tappedWeiAmount;

        // Get a reference to the project owner, which will receive the admin's tickets from paying the fee,
        // and receive any extra tapped funds not allocated to mods.
        address payable _projectOwner =
            payable(projects.ownerOf(_fundingCycle.projectId));

        // The amount of ETH from the _tappedAmount to pay as a fee.
        uint256 _govFeeAmount =
            _tappedWeiAmount -
                PRBMathCommon.mulDiv(
                    _tappedWeiAmount,
                    200,
                    _fundingCycle.fee + 200
                );

        if (_govFeeAmount > 0) {
            // When processing the admin fee, save gas if the admin is using this juice terminal.
            if (JuiceProject(governance).terminal() == this) {
                _pay(
                    JuiceProject(governance).projectId(),
                    _govFeeAmount,
                    _projectOwner,
                    "Juice fee",
                    false
                );
            } else {
                JuiceProject(governance).pay{value: _govFeeAmount}(
                    _projectOwner,
                    "Juice fee",
                    false
                );
            }
        }
        // Transfer the tapped amount minus the fees.
        uint256 _transferAmount = _tappedWeiAmount - _govFeeAmount;

        // Pay mods and get a reference to the leftover transfer amount after all mods have been paid.
        uint256 _leftoverTransferAmount =
            _payMods(_fundingCycle, _transferAmount);

        // Transfer any remaining balance to the beneficiary.
        if (_leftoverTransferAmount > 0)
            Address.sendValue(_projectOwner, _leftoverTransferAmount);

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
        @notice 
        Prints all reserved tickets for a project.

        @param _projectId The ID of the project to which the reserved tickets belong.

        @return amount The amount of tickets that are being printed.
    */
    function printReservedTickets(uint256 _projectId)
        external
        override
        returns (uint256 amount)
    {
        // Get the current funding cycle to read the reserved rate from.
        FundingCycle memory _fundingCycle =
            fundingCycles.getCurrentOf(_projectId);

        // Get a reference to new total supply of tickets before printing reserved tickets.
        uint256 _totalPreopTickets = ticketBooth.totalSupplyOf(_projectId);

        // Get a reference to the number of tickets that need to be printed.
        amount = _reservedTicketAmountFrom(
            _processedTicketTrackerOf[_projectId],
            // The reserved rate is in bits 9-24 of the metadata.
            uint256(uint8(_fundingCycle.metadata >> 8)),
            _totalPreopTickets
        );

        // Make sure there are tickets to print.
        require(amount > 0, "Juicer::printReservedTickets: NO_OP");

        // Make sure int casting isnt overflowing the int. 2^255 - 1 is the largest number that can be stored in an int.
        require(
            _totalPreopTickets + amount <= uint256(type(int256).max),
            "Juicer::printReservedTickets: INT_LIMIT_REACHED"
        );

        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Set the tracker to be the new total supply.
        _processedTicketTrackerOf[_projectId] = int256(
            _totalPreopTickets + amount
        );

        // Get a reference to the leftover reserved ticket amount after printing for all mods.
        uint256 _leftoverTicketAmount = amount;

        // Get a reference to the project's ticket mods.
        TicketMod[] memory _mods =
            modStore.ticketModsOf(_projectId, _fundingCycle.configured);

        //Transfer between all mods.
        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // Get a reference to the mod being iterated on.
            TicketMod memory _mod = _mods[_i];

            // The amount to send towards mods.
            uint256 _modCut = PRBMathCommon.mulDiv(amount, _mod.percent, 200);

            // Print tickets for the mod.
            ticketBooth.print(
                _mod.beneficiary,
                _projectId,
                _modCut,
                _mod.preferUnstaked
            );

            // Subtract from the amount to be sent to the beneficiary.
            _leftoverTicketAmount = _leftoverTicketAmount - _modCut;

            emit TicketModDistribution(
                _fundingCycle.id,
                _projectId,
                _mod,
                _modCut,
                msg.sender
            );
        }

        // Mint any remaining reserved tickets to the beneficiary.
        if (_leftoverTicketAmount > 0)
            ticketBooth.print(_owner, _projectId, _leftoverTicketAmount, false);

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
        @notice 
        Addresses can redeem their Tickets to claim the project's overflowed ETH.

        @param _account The account to redeem tickets for.
        @param _projectId The ID of the project to which the Tickets being redeemed belong.
        @param _count The number of Tickets to redeem.
        @param _minReturnedWei The minimum amount of Wei expected in return.
        @param _beneficiary The address to send the ETH to.
        @param _preferUnstaked If the preference is to redeem tickets that have been converted to ERC-20s.

        @return amount The amount of ETH that the tickets were redeemed for.
    */
    function redeem(
        address _account,
        uint256 _projectId,
        uint256 _count,
        uint256 _minReturnedWei,
        address payable _beneficiary,
        bool _preferUnstaked
    )
        external
        override
        nonReentrant
        requirePermissionAllowingWildcardDomain(
            _account,
            _projectId,
            Operations.Redeem
        )
        returns (uint256 amount)
    {
        // Can't send claimed funds to the zero address.
        require(_beneficiary != address(0), "Juicer::redeem: ZERO_ADDRESS");

        // The amount of ETH claimable by the message sender from the specified project by redeeming the specified number of tickets.
        amount = claimableOverflowOf(_account, _projectId, _count);

        // Nothing to do if the amount is 0.
        require(amount > 0, "Juicer::redeem: NO_OP");

        // The amount being claimed must be at least as much as was expected.
        require(amount >= _minReturnedWei, "Juicer::redeem: INADEQUATE");

        // Remove the redeemed funds from the project's balance.
        balanceOf[_projectId] = balanceOf[_projectId] - amount;

        // Get a reference to the processed ticket tracker for the project.
        int256 _processedTicketTracker = _processedTicketTrackerOf[_projectId];

        // Safely subtract the count from the processed ticket tracker.
        // Subtract from processed tickets so that the difference between whats been processed and the
        // total supply remains the same.
        // If there are at least as many processed tickets as there are tickets being redeemed,
        // the processed ticket tracker of the project will be positive. Otherwise it will be negative.
        // Make sure int casting isnt overflowing the int. 2^255 - 1 is the largest number that can be stored in an int.
        require(
            _count <= uint256(type(int256).max),
            "Juicer::redeem: INT_LIMIT_REACHED"
        );

        // Set the tracker.
        _processedTicketTrackerOf[_projectId] = _processedTicketTracker < 0 // If the tracker is negative, add the count and reverse it.
            ? -int256(uint256(-_processedTicketTracker) + _count) // the tracker is less than the count, subtract it from the count and reverse it.
            : _processedTicketTracker < int256(_count)
            ? -(int256(_count) - _processedTicketTracker) // simply subtract otherwise.
            : _processedTicketTracker - int256(_count);

        // Redeem the tickets, which removes and burns them from the account's wallet.
        ticketBooth.redeem(_account, _projectId, _count, _preferUnstaked);

        // Transfer funds to the specified address.
        Address.sendValue(_beneficiary, amount);

        emit Redeem(
            _account,
            _beneficiary,
            _projectId,
            _count,
            amount,
            msg.sender
        );
    }

    /**
        @notice 
        Allows a project owner to migrate its funds to a new contract that can manage a project's funds.

        @param _projectId The ID of the project being migrated.
        @param _to The contract that will gain the project's funds.
    */
    function migrate(uint256 _projectId, ITerminal _to)
        external
        override
        requirePermission(
            projects.ownerOf(_projectId),
            _projectId,
            Operations.Migrate
        )
        nonReentrant
    {
        // This Juicer must be the project's current terminal.
        require(
            terminalDirectory.terminalOf(_projectId) == this,
            "Juicer::migrate: UNAUTHORIZED"
        );

        // This Juicer must be the project's current terminal.
        // This Juicer must be the project's current terminal.
        // The migration destination must be allowed.
        require(migrationIsAllowed[_to], "Juicer::migrate: NOT_ALLOWED");

        // Get a reference to this project's current balance, included any earned yield.
        uint256 _balanceOf = balanceOf[_projectId];

        // Set the balance to 0.
        balanceOf[_projectId] = 0;

        // Move the funds to the new contract.
        _to.addToBalance{value: _balanceOf}(_projectId);

        // Switch the direct payment terminal.
        terminalDirectory.setTerminal(_projectId, _to);

        emit Migrate(_projectId, _to, _balanceOf, msg.sender);
    }

    /** 
      @notice 
      Receives and allocates funds belonging to the specified project.

      @param _projectId The ID of the project to which the funds received belong.
    */
    function addToBalance(uint256 _projectId) external payable override {
        balanceOf[_projectId] = balanceOf[_projectId] + msg.value;
        emit AddToBalance(_projectId, msg.value, msg.sender);
    }

    /**
        @notice 
        Adds to the contract addresses that projects can migrate their Tickets to.

        @param _contract The contract to allow.
    */
    function allowMigration(ITerminal _contract) external override onlyGov {
        // Can't allow the zero address.
        require(
            _contract != ITerminal(address(0)),
            "Juicer::allowMigration: ZERO_ADDRESS"
        );

        // Can't migrate to this same contract
        require(_contract != this, "Juicer::allowMigration: NO_OP");

        // Set the contract as allowed
        migrationIsAllowed[_contract] = true;

        emit AllowMigration(_contract);
    }

    /** 
      @notice 
      Allow the admin to change the fee. 

      @param _fee The new fee percent. Out of 200.
    */
    function setFee(uint256 _fee) external override onlyGov {
        // Fee must be under 100%.
        require(_fee <= 200, "Juicer::setFee: BAD_FEE");

        // Set the fee.
        fee = _fee;

        emit SetFee(_fee);
    }

    /** 
      @notice 
      Allows governance to transfer its privileges to another contract.

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
            "Juicer::appointGovernance: ZERO_ADDRESS"
        );
        // The new governance can't be the same as the current governance.
        require(
            _pendingGovernance != governance,
            "Juicer::appointGovernance: NO_OP"
        );

        // Set the appointed governance as pending.
        pendingGovernance = _pendingGovernance;

        emit AppointGovernance(_pendingGovernance);
    }

    /** 
      @notice 
      Allows contract to accept its appointment as the new governance.
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

    // --- private helper functions --- //

    /** 
      @notice 
      See the documentation for 'pay'.
    */
    function _pay(
        uint256 _projectId,
        uint256 _amount,
        address _beneficiary,
        string memory _memo,
        bool _preferUnstakedTickets
    ) private returns (uint256) {
        // Get a reference to the current funding cycle for the project.
        FundingCycle memory _fundingCycle =
            fundingCycles.getCurrentOf(_projectId);

        // Add to the balance of the project.
        balanceOf[_projectId] = balanceOf[_projectId] + _amount;

        // Multiply the amount by the funding cycle's weight to determine the amount of tickets to print.
        uint256 _weightedAmount =
            PRBMathUD60x18.mul(_amount, _fundingCycle.weight);

        // Only print the tickets that are unreserved.
        uint256 _unreservedWeightedAmount =
            PRBMathCommon.mulDiv(
                _weightedAmount,
                // The reserved rate is stored in bytes 9-24 of the metadata property.
                200 - uint256(uint8(_fundingCycle.metadata >> 8)),
                200
            );

        // Print the project's tickets for the beneficiary.
        ticketBooth.print(
            _beneficiary,
            _projectId,
            _unreservedWeightedAmount,
            _preferUnstakedTickets
        );

        emit Pay(
            _fundingCycle.id,
            _projectId,
            _beneficiary,
            _amount,
            _memo,
            msg.sender
        );

        return _fundingCycle.id;
    }

    /** 
      @notice
      Pays out the mods for the specified funding cycle.

      @param _fundingCycle The funding cycle to base the payment from.
      @param _amount The total amount being paid out.

      @return leftoverAmount If the mod percents dont add up to 100%, the leftover amount is returned.

    */
    function _payMods(FundingCycle memory _fundingCycle, uint256 _amount)
        private
        returns (uint256 leftoverAmount)
    {
        // Set the leftover amount to the initial amount.
        leftoverAmount = _amount;

        // Get a reference to the project's payment mods.
        PaymentMod[] memory _mods =
            modStore.paymentModsOf(
                _fundingCycle.projectId,
                _fundingCycle.configured
            );

        if (_mods.length == 0) return leftoverAmount;

        // Get the paying project's handle.
        bytes32 _handle = projects.handleOf(_fundingCycle.projectId);

        //Transfer between all mods.
        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // Get a reference to the mod being iterated on.
            PaymentMod memory _mod = _mods[_i];
            // The amount to send towards mods.
            uint256 _modCut = PRBMathCommon.mulDiv(_amount, _mod.percent, 200);

            // Transfer ETH to the mod.
            // If there's an allocator set, transfer to its `allocate` function.
            if (_mod.allocator != IModAllocator(address(0))) {
                _mod.allocator.allocate{value: _modCut}(
                    _fundingCycle.projectId,
                    _mod.projectId,
                    _mod.beneficiary
                );
                // Otherwise, if a project is specified, pay its Juice project.
            } else if (_mod.projectId != 0) {
                // Get a reference to the Juice terminal being used.
                ITerminal _terminal =
                    terminalDirectory.terminalOf(_mod.projectId);

                // The project must have a juice terminal to send funds to.
                require(
                    _terminal != ITerminal(address(0)),
                    "Juicer::tap: BAD_MOD"
                );

                // Make a memo using the paying project's handle.
                string memory _memo =
                    string(bytes.concat("Payment from @", _handle));

                // Save gas if this terminal is being used.
                if (_terminal == this) {
                    _pay(
                        _mod.projectId,
                        _modCut,
                        _mod.beneficiary,
                        _memo,
                        _mod.preferUnstaked
                    );
                } else {
                    _terminal.pay{value: _modCut}(
                        _mod.projectId,
                        _mod.beneficiary,
                        _memo,
                        _mod.preferUnstaked
                    );
                }

                // Otherwise, send the funds directly to the beneficiary.
            } else {
                Address.sendValue(_mod.beneficiary, _modCut);
            }

            // Subtract from the amount to be sent to the beneficiary.
            leftoverAmount = leftoverAmount - _modCut;

            emit PaymentModDistribution(
                _fundingCycle.id,
                _fundingCycle.projectId,
                _mod,
                _modCut,
                msg.sender
            );
        }
    }

    /** 
      @notice 
      Gets the amount overflowed in relation to the provided funding cycle.

      @param _currentFundingCycle The ID of the funding cycle to base the overflow on.

      @return overflow The current overflow of funds.
    */
    function _overflowFrom(FundingCycle memory _currentFundingCycle)
        private
        view
        returns (uint256)
    {
        // Get the current price of ETH.
        uint256 _ethPrice =
            prices.getETHPriceFor(_currentFundingCycle.currency);

        // Get a reference to the amount still tappable in the current funding cycle.
        uint256 _limit =
            _currentFundingCycle.target - _currentFundingCycle.tapped;

        // The amount of ETH currently that the owner could still tap if its available. This amount isn't considered overflow.
        uint256 _ethLimit =
            _limit == 0 ? 0 : PRBMathUD60x18.div(_limit, _ethPrice);

        // Get the current balance of the project with yield.
        uint256 _balanceOf = balanceOf[_currentFundingCycle.projectId];

        // Overflow is the balance of this project including any accumulated yields, minus the reserved amount.
        return _balanceOf < _ethLimit ? 0 : _balanceOf - _ethLimit;
    }

    /** 
      @notice 
      Gets the amount of reserved tickets that a project has given the specified total tickets.

      @param _processedTicketTracker The tracker to make the calculation with.
      @param _reservedRate The reserved rate to use to make the calculation.
      @param _totalSupply The total supply to make the calculation with.

      @return amount reserved ticket amount.
    */
    function _reservedTicketAmountFrom(
        int256 _processedTicketTracker,
        uint256 _reservedRate,
        uint256 _totalSupply
    ) private pure returns (uint256) {
        // Get a reference to the amount of tickets that are unprocessed.
        uint256 _unprocessedTicketBalanceOf =
            _processedTicketTracker >= 0
                ? _totalSupply - uint256(_processedTicketTracker)
                : _totalSupply + uint256(-_processedTicketTracker);

        // If there are no unprocessed tickets, return.
        if (_unprocessedTicketBalanceOf == 0) return 0;

        // If there are no unprocessed tickets, return.
        return
            PRBMathCommon.mulDiv(
                _unprocessedTicketBalanceOf,
                200,
                200 - _reservedRate
            ) - _unprocessedTicketBalanceOf;
    }

    /**
      @notice 
      Validate and pack the funding cycle metadata.

      @param _metadata The metadata to validate and pack.

      @return packed The packed uint256 of all metadata params. The first 8 bytes specify the version.
     */
    function _validateAndPackFundingCycleMetadata(
        FundingCycleMetadata memory _metadata
    ) private pure returns (uint256 packed) {
        // The reserved project ticket rate must be less than or equal to 200.
        require(
            _metadata.reservedRate <= 200,
            "Juicer::_validateAndPackFundingCycleMetadata: BAD_RESERVED_RATE"
        );

        // The bonding curve rate must be between 0 and 200.
        require(
            _metadata.bondingCurveRate <= 200,
            "Juicer::_validateAndPackFundingCycleMetadata: BAD_BONDING_CURVE_RATE"
        );

        // The reconfiguration bonding curve rate must be less than or equal to 200.
        require(
            _metadata.reconfigurationBondingCurveRate <= 200,
            "Juicer::_validateAndPackFundingCycleMetadata: BAD_RECONFIGURATION_BONDING_CURVE_RATE"
        );

        // version 0 in the first 8 bytes.
        packed = 0;
        // reserved rate in bytes 9-16.
        packed |= _metadata.reservedRate << 8;
        // bonding curve in bytes 17-24 bytes.
        packed |= _metadata.bondingCurveRate << 16;
        // reconfiguration bonding curve rate in bytes 25-32 bytes.
        packed |= _metadata.reconfigurationBondingCurveRate << 24;
    }
}
