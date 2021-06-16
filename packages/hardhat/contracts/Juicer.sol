// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

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

    // The current cumulative amount of tokens that a project has in this contract, without taking yield into account.
    mapping(uint256 => uint256) private _rawBalanceOf;

    // The difference between the processed ticket tracker of a project and the project's ticket's total supply is the amount of tickets that
    // still need to have reserves printed against them.
    mapping(uint256 => int256) private _processedTicketTrackerOf;

    // --- public immutable stored properties --- //

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice The contract storing all funding cycle configurations.
    IFundingCycles public immutable override fundingCycles;

    /// @notice The contract that manages Ticket printing and redeeming.
    ITickets public immutable override tickets;

    /// @notice The contract that stores mods for each project.
    IModStore public immutable override modStore;

    /// @notice The prices feeds.
    IPrices public immutable override prices;

    /// @notice The direct deposit terminals.
    ITerminalDirectory public immutable override terminalDirectory;

    // --- public stored properties --- //

    /// @notice The percent fee the Juice project takes from tapped amounts. Out of 200.
    uint256 public override fee = 10;

    /// @notice The governance of the contract who makes fees and can allow new Juicer contracts to be migrated to by project owners.
    address payable public override governance;

    /// @notice The governance of the contract who makes fees and can allow new Juicer contracts to be migrated to by project owners.
    address payable public override pendingGovernance;

    /// @notice The contract that puts idle funds to work.
    IYielder public override yielder;

    /// @notice The target amount of ETH to keep in this contract instead of depositing.
    uint256 public override targetLocalETH = 1000 * (10**18);

    // Whether or not a particular contract is available for projects to migrate their funds and Tickets to.
    mapping(ITerminal => bool) public override migrationIsAllowed;

    // --- public views --- //

    /** 
      @notice 
      Gets the total amount of funds that this Juicer is responsible for.

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
        if (yielder == IYielder(address(0))) {
            amountWithoutYield = _amount;
            amountWithYield = _amount;
        } else {
            amountWithoutYield = _amount + yielder.deposited();
            amountWithYield = _amount + yielder.getCurrentBalance();
        }
    }

    /** 
      @notice 
      Gets the balance for a specified project that this Juicer is responsible for.

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
            PRBMathCommon.mulDiv(
                _rawBalanceOf[_projectId],
                _balanceWithYield,
                _balanceWithoutYield
            );
    }

    /** 
      @notice 
      Gets the amount of reserved tickets that a project has.

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
        int256 _processedTicketTracker = _processedTicketTrackerOf[_projectId];

        // Get a reference to the amount of tickets that are unprocessed.
        uint256 _unprocessedTicketBalanceOf =
            _processedTicketTracker >= 0
                ? tickets.totalSupply(_projectId) -
                    uint256(_processedTicketTracker)
                : tickets.totalSupply(_projectId) +
                    uint256(-_processedTicketTracker);

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
            fundingCycles.getCurrent(_projectId);

        // Get the price of ETH.
        uint256 _ethPrice = prices.getETHPrice(_fundingCycle.currency);

        // Get a reference to the amount still tappable in the current funding cycle.
        uint256 _limit = _fundingCycle.target - _fundingCycle.tapped;

        // The amount of ETH currently that the owner could still tap if its available. This amount isn't considered overflow.
        uint256 _ethLimit =
            _limit == 0 ? 0 : PRBMathUD60x18.div(_limit, _ethPrice);

        // Get the current balance of the project with yield.
        uint256 _balanceOf = balanceOf(_projectId);

        // Overflow is the balance of this project including any accumulated yields, minus the reserved amount.
        return _balanceOf < _ethLimit ? 0 : _balanceOf - _ethLimit;
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
    function claimableOverflow(
        address _account,
        uint256 _projectId,
        uint256 _count
    ) public view override returns (uint256) {
        // The holder must have the specified number of the project's tickets.
        require(
            tickets.balanceOf(_account, _projectId) >= _count,
            "Juicer::claimableOverflow: INSUFFICIENT_FUNDS"
        );

        // Get the amount of current overflow.
        uint256 _currentOverflow = currentOverflowOf(_projectId);

        // If there is no overflow, nothing is claimable.
        if (_currentOverflow == 0) return 0;

        // Get the total number of tickets in circulation.
        uint256 _totalSupply = tickets.totalSupply(_projectId);

        // Get a reference to the current funding cycle for the project.
        FundingCycle memory _fundingCycle =
            fundingCycles.getCurrent(_projectId);

        // Get the number of reserved tickets the project has.
        uint256 _reservedTicketAmount =
            reservedTicketAmount(
                _projectId,
                // The reserved rate is in bits 9-24 of the metadata.
                uint256(uint16(_fundingCycle.metadata >> 8))
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
            fundingCycles.currentBallotState(_projectId) == BallotState.Active // The reconfiguration bonding curve rate is stored in bytes 41-56 of the metadata property.
                ? uint256(uint16(_fundingCycle.metadata >> 40)) // The bonding curve rate is stored in bytes 25-40 of the data property after.
                : uint256(uint16(_fundingCycle.metadata >> 24));

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
      @param _tickets A contract that manages Ticket printing and redeeming.
      @param _modStore A storage for a project's mods.
      @param _prices A price feed contract to use.
      @param _terminalDirectory A directory of a project's current Juice terminal to receive payments in.
    */
    constructor(
        IProjects _projects,
        IFundingCycles _fundingCycles,
        ITickets _tickets,
        IOperatorStore _operatorStore,
        IModStore _modStore,
        IPrices _prices,
        ITerminalDirectory _terminalDirectory,
        address payable _governance
    ) Operatable(_operatorStore) {
        require(
            _projects != IProjects(address(0)) &&
                _fundingCycles != IFundingCycles(address(0)) &&
                _tickets != ITickets(address(0)) &&
                _modStore != IModStore(address(0)) &&
                _prices != IPrices(address(0)) &&
                _terminalDirectory != ITerminalDirectory(address(0)) &&
                _governance != address(address(0)),
            "Juicer: ZERO_ADDRESS"
        );
        projects = _projects;
        fundingCycles = _fundingCycles;
        tickets = _tickets;
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

        // Configure the funding stage's state.
        FundingCycle memory _fundingCycle =
            fundingCycles.configure(
                _projectId,
                _properties,
                _validateAndPackFundingCycleMetadata(_metadata),
                fee,
                true
            );

        // Set any payment mods if there are any.
        if (_paymentMods.length > 0)
            modStore.setPaymentMods(
                _projectId,
                _fundingCycle.configured,
                _paymentMods
            );

        // Set any ticket mods if there are any.
        if (_ticketMods.length > 0)
            modStore.setTicketMods(
                _projectId,
                _fundingCycle.configured,
                _ticketMods
            );
    }

    /**
        @notice 
        Reconfigures the properties of the current funding stage if the project hasn't distributed tickets yet, or
        sets the properties of the proposed funding stage that will take effect once the current one expires.

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
            Operations.Configure,
            false
        )
        returns (uint256 fundingCycleId)
    {
        // Set the terminal if needed.
        // Must do this before the call to configure.
        if (terminalDirectory.terminals(_projectId) == ITerminal(address(0)))
            terminalDirectory.setTerminal(_projectId, this);

        // If the project doesn't have a balance, configure the active funding cycle instead of creating a standby one.
        bool _shouldConfigureActive = _rawBalanceOf[_projectId] == 0;

        // Configure the funding stage's state.
        FundingCycle memory _fundingCycle =
            fundingCycles.configure(
                _projectId,
                _properties,
                _validateAndPackFundingCycleMetadata(_metadata),
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
      @param _memo A memo to leave with the printing.
      @param _beneficiary The address to send the printed tickets to.
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
            Operations.PrintInitialTickets,
            false
        )
    {
        // Make sure the project doesn't have a balance.
        require(
            _rawBalanceOf[_projectId] == 0,
            "Juicer::printInitialTickets: TOO_LATE"
        );

        // Get the current funding cycle to read the weight and currency from.
        FundingCycle memory _fundingCycle =
            fundingCycles.getCurrent(_projectId);

        // Multiply the amount by the funding cycle's weight to determine the amount of tickets to print.
        uint256 _weightedAmount =
            PRBMathUD60x18.mul(_amount, _fundingCycle.weight);

        // Print the project's tickets for the beneficiary.
        tickets.print(
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
        @param _beneficiary The address to transfer the newly minted Tickets to. 
        @param _memo A memo that will be included in the published event.
        @param _preferUnstakedTickets Whether ERC20's should be claimed automatically if they have been issued.

        @return _fundingCycleId The ID of the funding stage that the payment was made during.
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
        Tap into funds that have been contributed to a project's funding cycles.

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
        FundingCycle memory _fundingCycle =
            fundingCycles.tap(_projectId, _amount);

        // Get a reference to this project's current balance, including any earned yield.
        uint256 _balanceOf = balanceOf(_fundingCycle.projectId);

        // Get the price of ETH.
        // The amount of ETH that is being tapped.
        uint256 _tappedETHAmount =
            PRBMathUD60x18.div(
                _amount,
                prices.getETHPrice(_fundingCycle.currency)
            );

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

        // Get a reference to the raw balance of the project.
        uint256 _rawBalance = _rawBalanceOf[_projectId];

        // Remove from the balance of the project.
        // Since the balance doesn't include any earned yield but the
        // `_tappedETHAmount` might include earned yields,
        // the correct proportion must be calculated.
        _rawBalanceOf[_fundingCycle.projectId] =
            _rawBalance -
            PRBMathCommon.mulDiv(
                // The the amount being tapped and used as a fee...
                _tappedETHAmount,
                // multiplied by the current balance without yield...
                _rawBalance,
                // divided by the total yielding balance of the project.
                _balanceOf
            );

        // The amount of ETH from the _tappedAmount to pay as a fee.
        uint256 _govFeeAmount =
            _tappedETHAmount -
                PRBMathCommon.mulDiv(
                    _tappedETHAmount,
                    200,
                    _fundingCycle.fee + 200
                );

        // Get a reference to the project owner, which will receive the admin's tickets from paying the fee,
        // and receive any extra tapped funds not allocated to mods.
        address payable _projectOwner =
            payable(projects.ownerOf(_fundingCycle.projectId));

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

        // Transfer the tapped amount minus the fees.
        uint256 _transferAmount = _tappedETHAmount - _govFeeAmount;

        // Make sure the amount being transfered is in the posession of this contract and not in the yielder.
        _ensureAvailability(_transferAmount);

        // Get a reference to the leftover transfer amount after all mods have been paid.
        uint256 _leftoverTransferAmount = _transferAmount;

        // Get a reference to the project's payment mods.
        PaymentMod[] memory _mods =
            modStore.paymentMods(
                _fundingCycle.projectId,
                _fundingCycle.configured
            );

        //Transfer between all mods.
        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // Get a reference to the mod being iterated on.
            PaymentMod memory _mod = _mods[_i];
            // The amount to send towards mods.
            uint256 _modCut =
                PRBMathCommon.mulDiv(_transferAmount, _mod.percent, 200);

            // Transfer ETH to the mod.
            // If there's an allocator set, transfer to its `allocate` function.
            if (_mod.allocator != IModAllocator(address(0))) {
                _mod.allocator.allocate{value: _modCut}(
                    _fundingCycle.projectId,
                    _mod.projectId,
                    _mod.beneficiary,
                    _mod.note
                );
                // Otherwise, if a project is specified, pay its Juice project.
            } else if (_mod.projectId != 0) {
                // Get a reference to the Juice terminal being used.
                ITerminal _terminal =
                    terminalDirectory.terminals(_mod.projectId);

                // The project must have a juice terminal to send funds to.
                require(
                    _terminal != ITerminal(address(0)),
                    "Juicer::tap: BAD_MOD"
                );

                // Save gas if this terminal is being used.
                if (_terminal == this) {
                    _pay(
                        _mod.projectId,
                        _modCut,
                        _mod.beneficiary,
                        _mod.note,
                        _mod.preferUnstaked
                    );
                } else {
                    _terminal.pay{value: _modCut}(
                        _mod.projectId,
                        _mod.beneficiary,
                        _mod.note,
                        _mod.preferUnstaked
                    );
                }
                // Otherwise, send the funds directly to the beneficiary.
            } else {
                Address.sendValue(_mod.beneficiary, _modCut);
            }

            // Subtract from the amount to be sent to the beneficiary.
            _leftoverTransferAmount = _leftoverTransferAmount - _modCut;

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
        Addresses can redeem their Tickets to claim the project's overflowed ETH.

        @param _account The account to redeem tickets for.
        @param _projectId The ID of the project to which the Tickets being redeemed belong.
        @param _count The number of Tickets to redeem.
        @param _minReturnedETH The minimum amount of ETH expected in return.
        @param _beneficiary The address to send the ETH to.
        @param _preferUnstaked If the preference is to redeem tickets that have been converted to ERC-20s.

        @return amount The amount of ETH that the tickets were redeemed for.
    */
    function redeem(
        address _account,
        uint256 _projectId,
        uint256 _count,
        uint256 _minReturnedETH,
        address payable _beneficiary,
        bool _preferUnstaked
    )
        external
        override
        nonReentrant
        requirePermission(_account, _projectId, Operations.Redeem, true)
        returns (uint256 amount)
    {
        // Can't send claimed funds to the zero address.
        require(_beneficiary != address(0), "Juicer::redeem: ZERO_ADDRESS");

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
        _rawBalanceOf[_projectId] =
            _rawBalanceOf[_projectId] -
            PRBMathCommon.mulDiv(
                // The amount redeemed...
                amount,
                // multiplied by the current balance amount with no yield considerations...
                _balanceWithoutYield,
                // divded by the total yielding balance of the project.
                _balanceWithYield
            );

        // Get a reference to the processed ticket tracker for the project.
        int256 _processedTicketTracker = _processedTicketTrackerOf[_projectId];

        // Set the tracker.
        _processedTicketTrackerOf[_projectId] = _processedTicketTracker < 0 // If the tracker is negative, add the count and reverse it.
            ? -int256(uint256(-_processedTicketTracker) + _count) // the tracker is less than the count, subtract it from the count and reverse it.
            : _processedTicketTracker < int256(_count)
            ? -(int256(_count) - _processedTicketTracker) // simply subtract otherwise.
            : _processedTicketTracker - int256(_count);

        // Make sure the amount being claimed is in the posession of this contract and not in the vault.
        _ensureAvailability(amount);

        // Redeem the tickets, which removes and burns them from the account's wallet.
        tickets.redeem(_account, _projectId, _count, _preferUnstaked);

        // Transfer funds to the specified address.
        Address.sendValue(_beneficiary, amount);

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
            fundingCycles.getCurrent(_projectId);

        // Get a reference to the number of tickets that need to be printed.
        amount = reservedTicketAmount(
            _projectId,
            // The reserved rate is in bits 9-24 of the metadata.
            uint256(uint16(_fundingCycle.metadata >> 8))
        );

        // Get a reference to new total supply of tickets.
        uint256 _totalTickets = tickets.totalSupply(_projectId) + amount;

        // Make sure int casting isnt overflowing the int. 2^255 - 1 is the largest number that can be stored in an int.
        require(
            _totalTickets <= uint256(type(int256).max),
            "Juicer::printReservedTickets: INT_LIMIT_REACHED"
        );

        // Set the tracker to be the new total supply.
        _processedTicketTrackerOf[_projectId] = int256(_totalTickets);

        // Get a reference to the leftover reserved ticket amount after printing for all mods.
        uint256 _leftoverTicketAmount = amount;

        // Get a reference to the project's ticket mods.
        TicketMod[] memory _mods =
            modStore.ticketMods(_projectId, _fundingCycle.configured);

        //Transfer between all mods.
        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // Get a reference to the mod being iterated on.
            TicketMod memory _mod = _mods[_i];

            // The amount to send towards mods.
            uint256 _modCut = PRBMathCommon.mulDiv(amount, _mod.percent, 200);

            // Print tickets for the mod.
            tickets.print(
                _mod.beneficiary,
                _projectId,
                _modCut,
                _mod.preferUnstaked
            );

            // Subtract from the amount to be sent to the beneficiary.
            _leftoverTicketAmount = _leftoverTicketAmount - _modCut;

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
      Deposit idle funds into the yielder while keeping the specified cash on hand.
    */
    function deposit() external override nonReentrant {
        // There must be a yielder.
        require(yielder != IYielder(address(0)), "Juicer::deposit: NOT_FOUND");

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
            Operations.Migrate,
            false
        )
        nonReentrant
    {
        // The migration destination must be allowed.
        require(migrationIsAllowed[_to], "Juicer::migrate: NOT_ALLOWED");

        // Get a reference to this project's current balance, included any earned yield.
        uint256 _balanceOf = balanceOf(_projectId);

        // Set the balance to 0.
        _rawBalanceOf[_projectId] = 0;

        // Make sure the necessary funds are in the posession of this contract.
        _ensureAvailability(_balanceOf);

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
        // Get a reference to the balances.
        (uint256 _balanceWithoutYield, uint256 _balanceWithYield) = balance();

        // Add the processed amount.
        _rawBalanceOf[_projectId] = _rawBalanceOf[_projectId] +
            _balanceWithYield ==
            0
            ? msg.value // Finds the number that increases _balanceWithoutYield the same proportion that (msg.value + _balanceWithYield) increases _balanceWithYield.
            : PRBMathCommon.mulDiv(
                _balanceWithoutYield,
                msg.value + _balanceWithYield,
                _balanceWithYield
            ) - _balanceWithoutYield;

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

        // Set the contract as allowed
        migrationIsAllowed[_contract] = true;

        emit AllowMigration(_contract);
    }

    /** 
      @notice 
      Sets the target amount of ETH to keep in this contract instead of depositing.

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
      @notice 
      Allow the admin to change the yielder. 

      @dev 
      The yielder can only be set once.

      @param _yielder The new yielder.
    */
    function setYielder(IYielder _yielder) external override onlyGov {
        // The yielder can only be set once. This is for security reasons.
        require(
            yielder == IYielder(address(0)),
            "Juicer::setYielder: ALREADY_SET"
        );

        // Set the yielder.
        yielder = _yielder;

        emit SetYielder(_yielder);
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
            "Juicer::setPendingGovernance: ZERO_ADDRESS"
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
            fundingCycles.getCurrent(_projectId);

        // Add to the raw balance of the project.
        _rawBalanceOf[_projectId] = _rawBalanceOf[_projectId] + _amount;

        // Multiply the amount by the funding cycle's weight to determine the amount of tickets to print.
        uint256 _weightedAmount =
            PRBMathUD60x18.mul(_amount, _fundingCycle.weight);

        // Only print the tickets that are unreserved.
        uint256 _unreservedWeightedAmount =
            PRBMathCommon.mulDiv(
                _weightedAmount,
                // The reserved rate is stored in bytes 9-24 of the metadata property.
                200 - uint256(uint16(_fundingCycle.metadata >> 8)),
                200
            );

        // Print the project's tickets for the beneficiary.
        tickets.print(
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
      Makes sure the specified amount is in the possession of this contract.

      @param _amount The amount to ensure.
    */
    function _ensureAvailability(uint256 _amount) private {
        // If there's no yielder, all funds are already in this contract.
        if (yielder == IYielder(address(0))) return;

        // Get a reference to the amount of ETH currently in this contract.
        uint256 _balance = address(this).balance;

        // No need to withdraw from the yielder if the current balance is greater than the amount being ensured.
        if (_balance >= _amount) return;

        // Withdraw the amount entirely from the yielder if there's no balance, otherwise withdraw the difference between the balance and the amount being ensured.
        yielder.withdraw(
            _balance == 0 ? _amount : _amount - _balance,
            payable(address(this))
        );
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
            "FundingCycles::_validateData: BAD_RESERVED_RATE"
        );

        // The bonding curve rate must be between 0 and 200.
        require(
            _metadata.bondingCurveRate > 0 && _metadata.bondingCurveRate <= 200,
            "FundingCycles::_validateData BAD_BONDING_CURVE_RATE"
        );

        // The reconfiguration bonding curve rate must be less than or equal to 200.
        require(
            _metadata.reconfigurationBondingCurveRate <= 200,
            "FundingCycles::_validateData: BAD_RECONFIGURATION_BONDING_CURVE_RATE"
        );

        // version 0 in the first 8 bytes.
        packed = 0;
        // reserved rate in bytes 9-24.
        packed |= _metadata.reservedRate << 8;
        // bonding curve in bytes 25-40 bytes.
        packed |= _metadata.bondingCurveRate << 24;
        // reconfiguration bonding curve rate in bytes 41-56 bytes.
        packed |= _metadata.reconfigurationBondingCurveRate << 40;
    }
}
