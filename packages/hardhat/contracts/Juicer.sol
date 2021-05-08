// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/IFundingCycles.sol";
import "./interfaces/IYielder.sol";
import "./interfaces/IProjects.sol";
import "./abstract/JuiceProject.sol";

import "./Tickets.sol";

import "./libraries/DSMath.sol";
import "./libraries/ProportionMath.sol";
import "./libraries/CompareMath.sol";
import "./libraries/FullMath.sol";

/**
  @notice This contract manages the Juice ecosystem, and manages the flow of funds.
  @dev  1. Deploy a project that specifies how much funds can be tapped over a set amount of time. 
        2. Anyone can pay your project in ETH, which gives them Tickets in return that can be redeemed for any of your project's overflow.
           They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
              - The contributed amount of ETH. The more someone contributes, the more Tickets they'll receive.
              - The target amount of your funding cycle. The bigger your funding cycle's target amount, the fewer tickets that'll be minted for each ETH paid.
              - The funding cycle's weight, which is a number that decreases with subsequent funding cycle at a configured discount rate. 
                This rate is called a "discount rate" because it allows you to give out more Tickets to those who contribute to your 
                earlier funding cycles, effectively giving earlier adopters a discounted rate.
        3. You can tap ETH up to your specified denominated amount. 
           Any overflow can be claimed by Ticket holders by redeeming tickets, otherwise it rolls over to your future funding periods.
        6. You can reconfigure your project at any time with the approval of a ballot that you pre set.
           The new configuration will go into effect once the current funding cycle one expires.

  @dev A project can transfer its funds, along with the power to mint/burn their Tickets, from this contract to another allowed contract at any time.
       Contracts that are allowed to take on the power to mint/burn Tickets can be set by this controller's admin.
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
    using SafeERC20 for IERC20;
    using FundingCycle for FundingCycle.Data;

    /// @dev Limit sustain, redeem, swap, and tap to being called one at a time and non reentrent.
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

    /// @notice The percent fee the Juice project takes from payments. Out of 1000.
    uint256 public constant override fee = 50;

    /// @notice The admin of the contract who makes admin fees and can take a handful of decisions over this contract's mechanics.
    address payable public override admin;

    /// @notice The projects contract.
    IProjects public immutable override projects;

    /// @notice The contract storing all funding cycle configurations.
    IFundingCycles public immutable override fundingCycles;

    /// @notice The contract that manages the Tickets.
    ITickets public immutable override tickets;

    /// @notice The contract that puts idle funds to work.
    IYielder public immutable override yielder;

    /// @notice The prices feeds.
    IPrices public immutable override prices;

    /// @notice A mapping of the addresses that are designated operators of each account.
    mapping(address => mapping(address => bool)) public override operators;

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
        // The amount of ETH available is this contract's balance plus whatever is in the yielder.
        amount = address(this).balance;
        _includeYield
            ? amount.add(yielder.getCurrentBalance())
            : amount.add(yielder.deposited());
    }

    /** 
      @notice Gets the balance for a specified project that this Juicer is responsible for.
      @param _projectId The ID of the project to get the balance of.
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

        // Get a reference to the amount that is processable for this project.
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

        // processed amount plus the processable amount, minus whats already been distributed.
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

        // Get the current balance of the project.
        uint256 _balanceOf = balanceOf(_projectId, true);

        // The amount of ETH currently that the owner could still tap if its available. This amount isn't considered overflow.
        uint256 _ethLimit =
            _limit == 0
                ? 0
                : DSMath.wdiv(
                    _limit,
                    prices.getETHPrice(_fundingCycle.currency)
                );

        // Overflow is the balance of this project including any accumulated yields, minus the reserved amount.
        return _balanceOf < _ethLimit ? 0 : _balanceOf.sub(_ethLimit);
    }

    /**
        @notice The amount of tokens that can be claimed by the given address.
        @param _account The address to get an amount for.
        Must be within the holder's balance.
        @param _projectId The ID of the project to get a claimable amount for.
        @param _count The number of Tickets that would be redeemed to get the resulting amount.
        @dev The _account must have at least _count tickets for the specified project.
        @return amount The amount of tokens that can be claimed.
    */
    function claimableAmount(
        address _account,
        uint256 _projectId,
        uint256 _count
    ) public view override returns (uint256) {
        // The holder must have the specified number of the project's tickets.
        require(
            tickets.balanceOf(_account, _projectId) >= _count,
            "Juice::claimableAmount: INSUFFICIENT_FUNDS"
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

        // The bonding curve rate is the first 16 bytes of the data property.
        uint256 _bondingCurveRate = uint16(_fundingCycle.data);

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
      @param _projects The Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _fundingCycles The funding cycle configurations.
      @param _tickets The ERC-1155 mapping projects to ticket holders.
      @param _prices The price feed contract to use.
      @param _yielder The contract responsible for earning yield on idle funds.
    */
    constructor(
        IProjects _projects,
        IFundingCycles _fundingCycles,
        ITickets _tickets,
        IPrices _prices,
        IYielder _yielder
    ) {
        projects = _projects;
        fundingCycles = _fundingCycles;
        tickets = _tickets;
        prices = _prices;
        yielder = _yielder;
    }

    /**
        @notice Deploys a project. This will mint an ERC-721 into the `_owner`'s account and configure a first funding cycle.
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
        @param _discountRate A number from 0-1000 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
        If it's 1000, each funding stage will have equal weight.
        If the number is 900, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
        If the number is 0, an non-recurring funding stage will get made.
        @param _data the _discountRate, _bondingCurveRate, and _reservedRate are uint16s packed together in order.
        @dev _bondingCurveRate The rate from 0-1000 at which a project's Tickets can be redeemed for surplus.
        If its 500, tickets redeemed today are woth 50% of their proportional amount, meaning if there are 100 total tickets and $40 claimable, 10 tickets can be redeemed for $2.
        @dev _reservedRate A number from 0-1000 indicating the percentage of each contribution's tickets that will be reserved for the project.
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
        FundingCycleMetadata memory _data,
        IFundingCycleBallot _ballot
    ) external override lock {
        // Only a msg.sender or a specified operator can deploy its project.
        require(
            msg.sender == _owner || operators[_owner][msg.sender],
            "Juicer::deploy: UNAUTHORIZED"
        );

        _validateData(_data);

        // Configure the project.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.configure(
                // Create the project and mint an ERC-721 for the `_owner`.
                // The identifiers for this project are not functional and done purely for branding by a project's PM.
                projects.create(_owner, _name, _handle, _logoUri, _link),
                _target,
                _currency,
                _duration,
                _discountRate,
                fee,
                IFundingCycleBallot(0),
                _data.bondingCurveRate |= _data.reservedRate << 16,
                true
            );

        emit Deploy(
            _fundingCycle.projectId,
            _owner,
            msg.sender,
            _fundingCycle.id,
            _name,
            _handle,
            _logoUri,
            _link,
            _target,
            _currency,
            _duration,
            _discountRate,
            _data,
            _ballot
        );
    }

    /**
        @notice Reconfigures the properties of the current funding stage if it hasn't yet received payments, or
        sets the properties of the proposed funding stage that will take effect once the current one expires.
        @dev The msg.sender must be the project of the funding cycle.
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
        @param _data the _discountRate, _bondingCurveRate, and _reservedRate are uint16s packed together in order.
        @dev _bondingCurveRate The rate from 0-1000 at which a project's Tickets can be redeemed for surplus.
        If its 500, tickets redeemed today are woth 50% of their proportional amount, meaning if there are 100 total tickets and $40 claimable, 10 tickets can be redeemed for $2.
        @dev _reservedRate A number from 0-1000 indicating the percentage of each contribution's tickets that will be reserved for the project.
        @param _ballot The new ballot that will be used to approve subsequent reconfigurations.
        @return fundingCycleId The id of the funding cycle that was successfully configured.
    */
    function reconfigure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        FundingCycleMetadata memory _data,
        IFundingCycleBallot _ballot
    ) external override lock returns (uint256) {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a msg.sender or a specified operator can reconfigure its.
        require(
            (_owner == msg.sender || operators[_owner][msg.sender]),
            "Juicer::reconfigure: UNAUTHORIZED"
        );

        _validateData(_data);

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
                _data.bondingCurveRate |= _data.reservedRate << 16,
                // If no tickets are currently issued, the active funding cycle can be configured.
                _totalTicketSupply == 0
            );

        emit Reconfigure(
            _fundingCycle.id,
            _fundingCycle.projectId,
            msg.sender,
            _target,
            _currency,
            _duration,
            _discountRate,
            _data,
            _ballot
        );

        return _fundingCycle.id;
    }

    function _validateData(FundingCycleMetadata memory _data) private {
        // // Unpack to validate extra data.
        // uint256 _bondingCurveRate = uint16(_data >> 16);
        // uint256 _reservedRate = uint16(_data >> 32);

        // The `bondingCurveRate` must be between 0 and 1000.
        require(
            _data.bondingCurveRate > 0 && _data.bondingCurveRate <= 1000,
            "FundingCycles::_validateData BAD_BONDING_CURVE_RATE"
        );

        // The reserved project ticket rate must be less than or equal to 1000.
        require(
            _data.reservedRate <= 1000,
            "FundingCycles::_validateData: BAD_RESERVED_RATE"
        );
    }

    /**
        @notice Contribute funds to a project.
        @dev Mints the project's tickets proportional to the amount of the contribution.
        @dev The sender must approve this contract to transfer the specified amount of tokens.
        @dev The msg.value is the amount of the contribution in ETH. Sent as 1E18.
        @param _projectId The ID of the project being contribute to.
        @param _beneficiary The address to transfer the newly minted Tickets to. 
        @param _note A note that will be included in the published event.
        @return _fundingCycleId The ID of the funding stage that successfully received the contribution.
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

        // Get a reference to the current funding cycle.
        FundingCycle.Data memory _fundingCycle = fundingCycles.get(_projectId);

        // Add to the processable amount for this project, which will be processed when tapped by distributing reserved tickets to this project's owner.
        processableAmount[_fundingCycle.projectId] = processableAmount[
            _fundingCycle.projectId
        ]
            .add(msg.value);

        // Print tickets for the beneficiary.
        tickets.print(
            _beneficiary,
            _projectId,
            _fundingCycle._weighted(
                msg.value,
                // The reserved rate are the second 16 bytes of the data property.
                uint256(1000).add(uint16(_fundingCycle.data >> 16))
            )
        );

        emit Pay(
            _fundingCycle.id,
            _projectId,
            msg.sender,
            _beneficiary,
            msg.value,
            _fundingCycle.currency,
            _note,
            _fundingCycle.fee
        );

        return _fundingCycle.id;
    }

    /**
        @notice Addresses can redeem their Tickets to claim overflowed tokens.
        @param _account The account to redeem tickets for.
        @param _projectId The ID of the project to which the Tickets being redeemed belong.
        @param _count The number of Tickets to redeem.
        @param _minReturnedETH The minimum amount of ETH expected in return.
        @param _beneficiary The address to send the tokens to.
        @return amount The amount that the tickets were redeemed for.
    */
    function redeem(
        address _account,
        uint256 _projectId,
        uint256 _count,
        uint256 _minReturnedETH,
        address payable _beneficiary
    ) external override lock returns (uint256 amount) {
        // Can't send claimed funds to the zero address.
        require(_beneficiary != address(0), "Juicer::redeem: ZERO_ADDRESS");

        // Only a msg.sender or a specified operator can redeem its tickets.
        require(
            msg.sender == _account || operators[_account][msg.sender],
            "Juicer::redeem: UNAUTHORIZED"
        );

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
        tickets.redeem(_projectId, msg.sender, _count);

        // Transfer funds to the specified address.
        _beneficiary.transfer(amount);

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
        @notice Tap into funds that have been contributed to your funding cycles.
        @param _projectId The ID of the project to which the funding cycle being tapped belongs.
        @param _amount The amount being tapped, in the funding cycle's currency.
        @param _beneficiary The address to transfer the funds to.
        @param _minReturnedETH The minimum number of ETH that the amount should be valued at.
    */
    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _currency,
        address payable _beneficiary,
        uint256 _minReturnedETH
    ) external override lock {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a project owner or a specified operator can tap its funds.
        require(
            msg.sender == _owner || operators[_owner][msg.sender],
            "Juicer::tap: UNAUTHORIZED"
        );

        // Can't tap funds to the zero address.
        require(_beneficiary != address(0), "Juicer::tap: ZERO_ADDRESS");

        // Process any processable payments to make sure all reserved tickets are distributed.
        _processPendingAmount(_projectId);

        // Get a reference to this project's current balance, included any earned yield.
        uint256 _projectBalance = balanceOf(_projectId, true);

        // Save the tapped state of the funding cycle.
        (
            uint256 _fundingCycleId,
            uint256 _tappedAmount,
            uint256 _adminFeeAmount
        ) =
            fundingCycles.tap(
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
                _tappedAmount,
                _projectBalance
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
            // Get a reference to the admin's funding cycle, which will be receiving the fee.
            FundingCycle.Data memory _adminFundingCycle =
                fundingCycles.getCurrent(_adminProjectId);

            // Add to the processable amount for the admin, which will eventually distribute reserved tickets to the admin's owner.
            processableAmount[_adminProjectId] = processableAmount[
                _adminProjectId
            ]
                .add(_adminFeeAmount);

            // Print admin tickets for the tapper.
            tickets.print(
                _beneficiary,
                _adminProjectId,
                _adminFundingCycle._weighted(
                    _adminFeeAmount,
                    // The reserved rate are the second 16 bytes of the data property.
                    uint256(1000).sub(uint16(_adminFundingCycle.data >> 16))
                )
            );

            // Transfer the tapped amount minus the fees.
            _transferAmount = _tappedAmount.sub(_adminFeeAmount);
        }

        // Make sure the amount being transfered is in the posession of this contract and not in the yielder.
        _ensureAvailability(_transferAmount);

        // Transfer the funds to the beneficiary.
        _beneficiary.transfer(_transferAmount);

        emit Tap(
            _fundingCycleId,
            _projectId,
            _beneficiary,
            msg.sender,
            _amount,
            _currency,
            _tappedAmount,
            _transferAmount
        );
    }

    /**
      @notice Deposit any overflow funds that are not earning interest into the yielder.
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
        @notice Allows a project owner to migrate its funds to a new Juicer.
        @param _projectId The ID of the project being migrated.
        @param _to The Juicer contract that will gain the project's funds.
    */
    function migrate(uint256 _projectId, IJuicer _to) external override lock {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // The migration destination must be allowed.
        require(
            migrationContractIsAllowed[address(_to)],
            "Juicer::migrate: BAD_DESTINATION"
        );

        // Only the project owner, or a delegated operator, can migrate its funds.
        require(
            msg.sender == _owner || operators[_owner][msg.sender],
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

        // Move the funds to the new Juicer.
        _to.addToBalance{value: _amount}(_projectId);

        emit Migrate(_projectId, msg.sender, _to, _amount);
    }

    /** 
      @notice Transfer funds from the message sender to this contract belonging to the specified project.
      @dev The msg.value is the amount that the claimable tokens are worth.
      @param _projectId The ID of the project to which the tickets getting credited with overflow belong.
    */
    function addToBalance(uint256 _projectId) external payable override lock {
        // Add the processed amount.
        processedAmount[_projectId] = processedAmount[_projectId].add(
            // Calculate the amount to add to the project's processed amount, removing any influence of yield accumulated prior to adding.
            ProportionMath.find(balance(false), msg.value, balance(true))
        );

        emit AddToBalance(_projectId, msg.sender);
    }

    /** 
      @notice Allows the specified operator tap funds and redeem tickets on the msg.sender's behalf.
      @param _operator The operator to give permission to.
    */
    function addOperator(address _operator) external override {
        operators[msg.sender][_operator] = true;
        emit AddOperator(msg.sender, _operator);
    }

    /** 
      @notice Revokes the ability for the specified operator to tap funds and redeem tickets on the msg.sender's behalf.
      @param _operator The operator to give permission to.
    */
    function removeOperator(address _operator) external override {
        operators[msg.sender][_operator] = false;
        emit RemoveOperator(msg.sender, _operator);
    }

    /**
        @notice The admin of this contract.
        @dev Can be set once. The admin will set this upon being deployed.
        @param _admin The admin to set.
    */
    function setAdmin(address payable _admin) external override {
        require(admin == address(0), "Juicer::setAdmin: ALREADY_SET");
        admin = _admin;
        emit SetAdmin(_admin);
    }

    /**
        @notice Adds to the contract addresses that projects can migrate their Tickets to.
        @param _allowed The contract to allow.
    */
    function allowMigration(address _allowed) external override onlyAdmin {
        migrationContractIsAllowed[_allowed] = true;
        emit AddToMigrationAllowList(_allowed);
    }

    // --- private transactions --- //

    /** 
      @notice Makes sure the requested amount is in the posession of this contract.
      @param _amount The amount to ensure.
    */
    function _ensureAvailability(uint256 _amount) private {
        uint256 _balance = address(this).balance;
        // No need to withdraw from the yielder if the current balance is greater than the amount being ensured.
        if (_balance >= _amount) return;
        // Withdraw the amount entirely from the yielder if there's no balance, otherwise withdraw the difference between the balance and the amount being ensured.
        yielder.withdraw(
            _balance == 0 ? _amount : _amount.sub(_balance),
            address(this)
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

        // Get a reference to the current funding cycle.
        FundingCycle.Data memory _fundingCycle =
            fundingCycles.getCurrent(_projectId);

        // The reserved rate are the second 16 bytes of the data property.
        uint256 _reservedRate = uint16(_fundingCycle.data >> 16);

        // Print tickets for the project owner if needed.
        if (_reservedRate > 0) {
            tickets.print(
                projects.ownerOf(_projectId),
                _projectId,
                _fundingCycle._weighted(_processableAmount, _reservedRate)
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

    receive() external payable {}
}
