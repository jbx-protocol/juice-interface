// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/IBudgetStore.sol";
import "./interfaces/IOverflowYielder.sol";
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
      @return The amount of overflow.
    */
    function getTotalOverflow() external view override returns (uint256) {
        // If there's no overflow yielder, all of the overflow is depositable.
        if (overflowYielder != IOverflowYielder(0)) {
            return overflowYielder.getBalance(weth).add(depositable);
        } else {
            return depositable;
        }
    }

    /** 
      @notice Gets the overflow for a specified issuer that this Juicer is responsible for.
      @param _project The project to get overflow for.
      @return The amount of overflow.
    */
    function getOverflow(bytes32 _project)
        external
        view
        override
        returns (uint256)
    {
        // The raw amount that the issuer can claim.
        uint256 _claimable = ticketStore.claimable(_project);

        // Return 0 if the user can't claim anything.
        if (_claimable == 0) return 0;

        // The total raw amount that is claimable.
        uint256 _totalClaimable = ticketStore.totalClaimable();

        // If an overflow yielder isn't set, all funds are still depositable.
        if (overflowYielder != IOverflowYielder(0)) {
            // The overflow is either in the overflow yielder or still depositable.
            // The proportion belonging to this issuer is the same proportion as the raw values in the Ticket store.
            return
                DSMath.wdiv(
                    DSMath.wmul(
                        overflowYielder.getBalance(weth).add(depositable),
                        _claimable
                    ),
                    _totalClaimable
                );
        } else {
            return
                DSMath.wdiv(
                    DSMath.wmul(depositable, _claimable),
                    _totalClaimable
                );
        }
    }

    // --- external transactions --- //

    /** 
      @param _budgetStore The BudgetStore to use.
      @param _ticketStore The TicketStore to use.
      @param _weth The address for weth.
    */
    constructor(
        IBudgetStore _budgetStore,
        ITicketStore _ticketStore,
        IERC20 _weth
    ) {
        budgetStore = _budgetStore;
        ticketStore = _ticketStore;
        weth = _weth;
    }

    /**
        @notice Issues a project's Tickets that'll be handed out by their budgets in exchange for payments.
        @dev Only callable by the project's owner.
        @param _project The project of the tickets being issued.
        @param _name The ERC-20's name.
        @param _symbol The ERC-20's symbol.
    */
    function issueTickets(
        bytes32 _project,
        string memory _name,
        string memory _symbol
    ) external override {
        require(
            msg.sender == budgetStore.projectOwner(_project),
            "Juicer::issueTickets: UNAUTHORIZED"
        );
        ticketStore.issue(_project, _name, _symbol);
    }

    /**
        @notice Contribute funds to a project's active Budget.
        @dev Mints the project's tickets proportional to the amount of the contribution.
        @dev The sender must approve this contract to transfer the specified amount of tokens.
        @param _project The project of the budget to contribute funds to.
        @param _amount Amount of the contribution in ETH. Sent as 1E18.
        @param _beneficiary The address to transfer the newly minted Tickets to. 
        @param _note A note that will be included in the published event.
        @return _budgetId The ID of the Budget that successfully received the contribution.
    */
    function pay(
        bytes32 _project,
        uint256 _amount,
        address _beneficiary,
        string memory _note
    ) external override lock returns (uint256) {
        // Positive payments only.
        require(_amount > 0, "Juicer::pay: BAD_AMOUNT");

        return _pay(_project, _amount, _beneficiary, _note);
    }

    /**
        @notice Addresses can redeem their Tickets to claim overflowed tokens.
        @param _project The project of the Tickets being redeemed.
        @param _amount The amount of Tickets to redeem.
        @param _minReturnedETH The minimum amount of ETH expected in return.
        @param _beneficiary The address to send the tokens to.
        @return returnAmount The amount that the tickets were redeemed for.
    */
    function redeem(
        bytes32 _project,
        uint256 _amount,
        uint256 _minReturnedETH,
        address _beneficiary
    ) external override lock returns (uint256 returnAmount) {
        // Get the current budget.
        Budget.Data memory _budget = budgetStore.getCurrentBudget(_project);

        // Redeem at the ticket store. The raw amount claimable for this issuer is returned.
        uint256 _claimable =
            ticketStore.redeem(
                _project,
                msg.sender,
                _amount,
                _minReturnedETH,
                _budget.bondingCurveRate
            );

        uint256 _baseReturnAmount = depositable;

        if (overflowYielder != IOverflowYielder(0))
            _baseReturnAmount.add(overflowYielder.getBalance(weth));

        // The amount that will be redeemed is the total amount earning yield plus what's depositable, times the ratio of raw tokens this issuer has accumulated.
        returnAmount = Math.mulDiv(
            _baseReturnAmount,
            _claimable,
            ticketStore.totalClaimable()
        );

        // Subtract the depositable amount if needed.
        if (returnAmount <= depositable) {
            depositable = depositable.sub(returnAmount);
            // Simply withdraw from the overflow yielder if there's nothing depositable.
        } else if (depositable == 0) {
            overflowYielder.withdraw(returnAmount, weth);
            // Withdraw the difference between whats depositable and whats being returned, while setting depositable to 0.
        } else {
            overflowYielder.withdraw(returnAmount.sub(depositable), weth);
            depositable = 0;
        }

        // Transfer funds to the specified address.
        weth.safeTransfer(_beneficiary, returnAmount);

        emit Redeem(
            msg.sender,
            _project,
            _beneficiary,
            _amount,
            returnAmount,
            weth
        );
    }

    /**
        @notice Tap into funds that have been contrubuted to your Budgets.
        @param _amount The amount to tap.
        @param _currency The currency to tap.
        @param _beneficiary The address to transfer the funds to.
        @param _minReturnedETH The minimum number of Eth that the amount should be valued at.
    */
    function tap(
        uint256 _budgetId,
        uint256 _amount,
        uint256 _currency,
        address _beneficiary,
        uint256 _minReturnedETH
    ) external override lock {
        // Get a reference to the Budget being tapped, the amount to tap, and any overflow that tapping creates.
        (Budget.Data memory _budget, uint256 _tappedAmount, uint256 _overflow) =
            budgetStore.tap(_budgetId, msg.sender, _amount, _currency);

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
            _budget.project,
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
        @notice Allows an project to migrate their Tickets' control to another contract.
        @dev This makes each project's Ticket's portable.
        @dev Make sure you know what you're doing. This is a one way migration
        @param _project The project being migrated.
        @param _to The Juicer contract that will gain minting and burning privileges over the Tickets.
    */
    function migrate(bytes32 _project, IJuicer _to) external override lock {
        require(
            migrationContractIsAllowed[address(_to)],
            "Juicer::migrate: BAD_DESTINATION"
        );

        require(
            budgetStore.projectOwner(_project) == msg.sender,
            "Juicer::migrate: UNAUTHORIZED"
        );

        // The message sender must own a project.
        require(_project != 0, "Juicer::migrate: NOT_FOUND");

        // Get a reference to the project's Tickets.
        Tickets _tickets = ticketStore.tickets(_project);

        // The project must have issued Tickets.
        require(_tickets != Tickets(0), "Juicer::migrate: NOT_FOUND");

        // Give the new project admin privileges.
        _tickets.transferOwnership(address(_to));

        // In order to move funds over, determine the proportion of funds belonging to the message sender.
        uint256 _totalClaimable = ticketStore.totalClaimable();
        uint256 _claimable = ticketStore.clearClaimable(_project);

        // Move all claimable tokens for this issuer.
        // Assumes the new contract uses the same ticket store.
        uint256 _amount =
            (overflowYielder.getBalance(weth).add(depositable))
                .mul(_claimable)
                .div(_totalClaimable);

        // Subtract the depositable amount if needed.
        if (_amount <= depositable) {
            depositable = depositable.sub(_amount);
            // Withdraw from the overflow yielder if there's nothing depositable.
        } else if (depositable == 0) {
            overflowYielder.withdraw(_amount, weth);
            // Withdraw the difference between whats depositable and whats being returned, while setting depositable to 0.
        } else {
            overflowYielder.withdraw(_amount.sub(depositable), weth);
            depositable = 0;
        }

        // Allow the new project to move funds owned by the issuer from contract.
        weth.safeApprove(address(_to), _amount);
        _to.addOverflow(_project, _amount, weth);

        emit Migrate(_to, _amount);
    }

    /** 
      @notice Transfer funds from the message sender to this contract that should be designated as overflow for the provided ticket issuer.
      @param _project The project of the tickets getting credited with overflow.
      @param _amount The amount that the claimable tokens are worth.
      @param _token The token of the specified amount.
    */
    function addOverflow(
        bytes32 _project,
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

        // The raw amount to add as claimable to the ticket store.
        uint256 _claimableToAdd =
            (
                _totalClaimable.mul(_overflowBefore.add(_amount)).div(
                    _overflowBefore
                )
            )
                .sub(_totalClaimable);

        // Add the raw claimable amount to the ticket store.
        ticketStore.addClaimable(_project, _claimableToAdd);
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

    // --- private transactions --- //

    /**
        @notice Contribute funds to a project's active Budget.
        @dev Mints the project's tickets proportional to the amount of the contribution.
        @dev The sender must approve this contract to transfer the specified amount of tokens.
        @param _project The project of the budget to contribute funds to.
        @param _amount Amount of the contribution in ETH. Sent as 1E18.
        @param _beneficiary The addresses to give the newly minted Tickets to. 
        @param _note A note that will be included in the published event.
        @return _budgetId The ID of the Budget that successfully received the contribution.
    */
    function _pay(
        bytes32 _project,
        uint256 _amount,
        address _beneficiary,
        string memory _note
    ) private returns (uint256) {
        // Do the operation in the budget store, which returns the Budget that was updated and the amount that should be transfered.
        (
            Budget.Data memory _budget,
            address _owner,
            uint256 _covertedCurrencyAmount,
            uint256 _overflow
        ) = budgetStore.payProject(_project, _amount);

        // Transfer.
        weth.safeTransferFrom(msg.sender, address(this), _amount);

        // Take fee through the admin's own budget, minting tickets for the project paying the fee.
        _takeFee(
            _owner,
            JuiceProject(admin).project(),
            Math.mulDiv(_amount, _budget.fee, 1000),
            _beneficiary
        );

        if (_budget.reserved > 0) {
            // The project gets the budget's project percentage, if one is specified.
            ticketStore.print(
                _project,
                _owner,
                _budget._weighted(_covertedCurrencyAmount, _budget.reserved)
            );
        }

        // Mint the appropriate amount of tickets for the contributor.
        ticketStore.print(
            _project,
            _beneficiary,
            _budget._weighted(
                _covertedCurrencyAmount,
                uint256(1000).sub(_budget.reserved)
            )
        );

        // If theres new overflow, give to beneficiary and add the amount of contributed funds that went to overflow to the claimable amount.
        if (_overflow > 0) _addOverflow(_budget, _overflow);

        emit Pay(
            _budget.id,
            _budget.project,
            msg.sender,
            _beneficiary,
            _amount,
            _covertedCurrencyAmount,
            _budget.currency,
            _note,
            _budget.fee
        );

        return _budget.id;
    }

    /**
        @notice Takes a fee for the admin's active budget.
        @param _from The owner of the project that the fee is being taken from.
        @param _project The project the fee is going to.
        @param _amount Amount of the fee in ETH. Sent as 1E18.
        @param _beneficiary The address to split the newly minted Tickets with. 
    */
    function _takeFee(
        address _from,
        bytes32 _project,
        uint256 _amount,
        address _beneficiary
    ) private {
        // Do the operation in the budget store, which returns the Budget that was updated and the amount that should be transfered.
        (
            Budget.Data memory _budget,
            address _owner,
            uint256 _covertedCurrencyAmount,
            uint256 _overflow
        ) = budgetStore.payProject(_project, _amount);

        if (_budget.reserved > 0) {
            // The project gets the budget's project percentage, if one is specified.
            ticketStore.print(
                _project,
                _owner,
                _budget._weighted(_covertedCurrencyAmount, _budget.reserved)
            );
        }

        // Split the weighted amount in two.
        uint256 _printAmount =
            _budget
                ._weighted(
                _covertedCurrencyAmount,
                uint256(1000).sub(_budget.reserved)
            )
                .div(2);

        // Mint the appropriate amount of tickets for the beneficiary.
        ticketStore.print(_project, _beneficiary, _printAmount);

        // Mint the appropriate amount of tickets for the project owner that the fee is being taken from.
        ticketStore.print(_project, _from, _printAmount);

        // If theres new overflow, give to beneficiary and add the amount of contributed funds that went to overflow to the claimable amount.
        if (_overflow > 0) _addOverflow(_budget, _overflow);

        emit TakeFee(
            _budget.id,
            _project,
            _from,
            _beneficiary,
            _amount,
            _covertedCurrencyAmount,
            _budget.currency
        );
    }

    // --- private transactions --- //

    /** 
      @notice Add overflow correctly by giving the pre-allocated amount to the budget's beneficiary 
      and adding the amount to the claimable amount.
      @param _budget The budget that the overflow came from.
      @param _amount The amount of overflow.
    */
    function _addOverflow(Budget.Data memory _budget, uint256 _amount) private {
        // The portion of the overflow that is claimable by redeeming tickets.
        // This is the total minus the percent used as a fee.
        uint256 _claimablePortion =
            Math.mulDiv(_amount, uint256(1000).sub(_budget.fee), 1000);

        // The redeemable portion of the overflow can be deposited to earn yield.
        depositable = depositable.add(_claimablePortion);

        // Add to the claimable amount.
        ticketStore.addClaimable(_budget.project, _claimablePortion);
    }
}
