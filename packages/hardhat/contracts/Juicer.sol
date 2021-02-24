// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/IBudgetStore.sol";
import "./interfaces/IOverflowYielder.sol";

import "./TicketStore.sol";

/**
  @notice This contract manages all funds in the Juice ecosystem.
  @dev  1 (optional). A project owner issues their Tickets at the ticket store.
        2. A project owner configures their first Budget at the budget store.
        3. Any address (end user or smart contract) can contribute funds to a Budget in this Juicer contract.
           In return, your contributors receive some of your project's tickets. 
           They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
              - The contributed amount. The more someone contributes, the more Tickets they'll receive.
              - The target amount of your Budget. The bigger your Budget's target amount, the fewer tickets that'll be minted for each token paid.
              - The Budget's weight, which is a number that decreases with each of your Budgets at a configured `discountRate`. 
                This rate is called a `discountRate` because it allows you to give out more Tickets to contributors to your 
                current Budget than to future budgets.
        4. As the project owner, you can collect any funds made to your Budget within your configured target.
           Any overflow will be accounted for seperately. 
        5. Your project's Ticket holders can redeem their Tickets for a share of your project's accumulated overflow along a bonding curve. 
           The bonding curve starts at 38.2%, meaning each ticket can be redeemed for 38.2% of its proportial overflow.
           For example, if there were 100 tickets circulating and 100 DAI of unclaimed overflow, 10 tickets could be redeemed for 3.82 DAI.
           The rest is left to share between the remaining ticket hodlers.
        6. You can reconfigure your Budget at any time with the approval of your Ticket holders, 
           The new configuration will go into effect once the current budget one expires.

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
    modifier onlyAdmin() {
        require(msg.sender == admin, "Juicer: UNAUTHORIZED");
        _;
    }

    // --- private properties --- //

    // If a particulate contract is available for project owners to migrate their Tickets to.
    mapping(address => bool) private migrationContractIsAllowed;

    // --- public properties --- //

    /// @notice The amount of time a Budget must be in standby before it can become active.
    /// @dev This allows for a voting period of 3 days.
    uint256 public constant override RECONFIGURATION_VOTING_PERIOD = 269200;

    /// @notice The admin of the contract who makes admin fees and can take fateful decisions over this contract's mechanics.
    address public override admin;

    /// @notice The contract storing all Budget state variables.
    IBudgetStore public immutable override budgetStore;

    /// @notice The contract that manages the Tickets.
    ITicketStore public immutable override ticketStore;

    /// @notice The contract that puts overflow to work.
    IOverflowYielder public override overflowYielder;

    /// @notice The amount of tokens that are currently depositable.
    uint256 public override depositable = 0;

    /// @notice The percent fee the contract owner takes from overflow.
    uint256 public immutable override fee;

    /// @notice The rate that describes the bonding curve at which tickets are redeemable.
    uint256 public override bondingCurveRate = 382;

    /// @notice The amounts stashed for each address, including the admin and any donations.
    mapping(address => uint256) public override stashed;

    /// @notice The address of a stablecoin ERC-20 token.
    IERC20 public override stablecoin;

    /// @notice The latest budget ID that has distributed reserves for each ticket issuer.
    mapping(address => uint256) public override latestDistributedBudgetId;

    // --- external views --- //

    /** 
      @notice Gets the total overflow that this Juicer is responsible for.
      @return The amount of overflow.
    */
    function getTotalOverflow() external view override returns (uint256) {
        // If there's no overflow yielder, all of the overflow is depositable.
        if (overflowYielder != IOverflowYielder(0)) {
            return overflowYielder.getBalance(stablecoin).add(depositable);
        } else {
            return depositable;
        }
    }

    /** 
      @notice Gets the overflow for a specified issuer that this Juicer is responsible for.
      @param _issuer The ticket issuer to get overflow for.
      @return The amount of overflow.
    */
    function getOverflow(address _issuer)
        external
        view
        override
        returns (uint256)
    {
        // The raw amount that the issuer can claim.
        uint256 _claimable = ticketStore.claimable(_issuer);

        // Return 0 if the user can't claim anything.
        if (_claimable == 0) return 0;

        // The total raw amount that is claimable.
        uint256 _totalClaimable = ticketStore.totalClaimable();

        // If an overflow yielder isn't set, all funds are still depositable.
        if (overflowYielder != IOverflowYielder(0)) {
            // The overflow is either in the overflow yielder or still depositable.
            // The proportion belonging to this issuer is the same proportion as the raw values in the Ticket store.
            return
                (overflowYielder.getBalance(stablecoin).add(depositable))
                    .mul(_claimable)
                    .div(_totalClaimable);
        } else {
            return depositable.mul(_claimable).div(_totalClaimable);
        }
    }

    /**
        @notice The amount of pending admin fees, donatations to beneficiaries, and mintable tickets for budget owners.
        @dev Reserved tickets are only mintable once a Budget expires.
        @dev This logic should be the same as `distributeReserves` in Juicer.
        @param _issuer The Tickets issuer whos Budgets are being searched for unminted reserved tickets.
        @param _onlyDistributable Only return reserves that are distributable.
        @return issuerTickets The amount of unminted reserved tickets belonging to issuer of the tickets.
        @return adminFees The amount of fees belonging to the admin.
        @return beneficiaryDonations The amount of donations belonging to the beneficiaries.
    */
    function getReserves(address _issuer, bool _onlyDistributable)
        public
        view
        override
        returns (
            uint256 issuerTickets,
            uint256 adminFees,
            uint256 beneficiaryDonations
        )
    {
        // Get a reference to the owner's latest Budget.
        Budget.Data memory _budget = budgetStore.getLatestBudget(_issuer);

        // Get the id of the latest distributed budget for this issuer.
        uint256 _latestDistributedBudgetId = latestDistributedBudgetId[_issuer];

        // Iterate sequentially through the owner's Budgets, starting with the latest one.
        // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
        while (_budget.id > 0 && _budget.id < _latestDistributedBudgetId) {
            // If the budget has overflow and is redistributing, it has unminted reserved tickets.
            if (
                !_onlyDistributable ||
                _budget._state() == Budget.State.Redistributing
            ) {
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
      @param _stablecoin A stablecoin contract.
    */
    constructor(
        IBudgetStore _budgetStore,
        ITicketStore _ticketStore,
        uint256 _fee,
        IERC20 _stablecoin
    ) public {
        budgetStore = _budgetStore;
        ticketStore = _ticketStore;
        fee = _fee;
        stablecoin = _stablecoin;
    }

    /**
      @notice The amount of tickets that will be issued as a result of a payment of the specified amount to the specified budget.
      @param _budgetId The ID of the budget to get the ticket value of.
      @param _amount The amount to get the ticket value of.
      @return The amount of tickets.
    */
    function getTicketRate(uint256 _budgetId, uint256 _amount)
        external
        view
        override
        returns (uint256)
    {
        Budget.Data memory _budget = budgetStore.getBudget(_budgetId);
        return _budget._weighted(_amount, uint256(100).sub(_budget.o).sub(fee));
    }

    /**
      @notice The amount of tickets that will be reserved for the budget's owner as a result of a payment of the specified amount to the specified budget.
      @param _budgetId The ID of the budget to get the ticket value of.
      @param _amount The amount to get the ticket value of.
      @return The amount of tickets.
    */
    function getReservedTicketRate(uint256 _budgetId, uint256 _amount)
        external
        view
        override
        returns (uint256)
    {
        Budget.Data memory _budget = budgetStore.getBudget(_budgetId);
        return _budget._weighted(_amount, _budget.o);
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

        // Do the operation in the budget store, which returns the Budget that was updated and the amount that should be transfered.
        (Budget.Data memory _budget, uint256 _transferAmount) =
            budgetStore.payOwner(
                _owner,
                msg.sender,
                _amount,
                RECONFIGURATION_VOTING_PERIOD
            );

        // The amount that is overflowing from the Budget.
        uint256 _overflow =
            _budget.total > _budget.target
                ? _budget.total.sub(_budget.target)
                : 0;

        // Transfer if needed.
        if (_transferAmount > 0)
            _budget.want.safeTransferFrom(
                msg.sender,
                address(this),
                _transferAmount
            );

        // Stablecoin is the only supported token at the moment.
        require(
            _budget.want == stablecoin,
            "Juicer::payOwner: TOKEN_NOT_SUPPORTED"
        );

        // If the Budget has overflow, give to beneficiary and add the amount of contributed funds that went to overflow to the claimable amount.
        if (_overflow > 0) {
            uint256 _contributedOverflow =
                _amount > _overflow ? _overflow : _amount;

            // The portion of the contributed overflow that is redeemable. This is the total minus the percent donated and used as a fee.
            uint256 _redeemablePortion =
                _contributedOverflow.mul(_budget.b.add(fee)).div(1000);

            // The redeemable portion of the overflow can be deposited to earn yield.
            depositable = depositable.add(_redeemablePortion);

            // Add to the raw amount claimable.
            ticketStore.addClaimable(
                _budget.owner,
                _contributedOverflow.sub(_redeemablePortion)
            );
        }

        // Mint the appropriate amount of tickets for the contributor.
        ticketStore.mint(
            _beneficiary,
            _budget.owner,
            _budget._weighted(_amount, uint256(100).sub(_budget.o))
        );

        emit PayOwner(
            _budget.id,
            _budget.owner,
            msg.sender,
            _beneficiary,
            _amount,
            _budget.want
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
        // The total raw amount claimable in the ticket store.
        uint256 _totalClaimable = ticketStore.totalClaimable();

        // Redeem at the ticket store. The raw amount claimable for this issuer is returned.
        uint256 _claimable =
            ticketStore.redeem(
                _issuer,
                msg.sender,
                _amount,
                _minReturn,
                bondingCurveRate
            );

        // The amount that will be redeemed is the total amount earning yield plus what's depositable, times the ratio of raw tokens this issuer has accumulated.
        returnAmount = (overflowYielder.getBalance(stablecoin).add(depositable))
            .mul(_claimable)
            .div(_totalClaimable);

        // Subtract the depositable amount if needed.
        if (returnAmount <= depositable) {
            depositable = depositable.sub(returnAmount);
            // Simply withdraw from the overflow yielder if there's nothing depositable.
        } else if (depositable == 0) {
            overflowYielder.withdraw(returnAmount, stablecoin);
            // Withdraw the difference between whats depositable and whats being returned, while setting depositable to 0.
        } else {
            overflowYielder.withdraw(returnAmount.sub(depositable), stablecoin);
            depositable = 0;
        }

        // Transfer funds to the specified address.
        stablecoin.safeTransfer(_beneficiary, returnAmount);

        emit Redeem(
            msg.sender,
            _issuer,
            _beneficiary,
            _amount,
            returnAmount,
            stablecoin
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
        Budget.Data memory _budget =
            budgetStore.tap(_budgetId, msg.sender, _amount, fee);

        // Transfer the funds to the specified address.
        _budget.want.safeTransfer(_beneficiary, _amount);

        // Distribute reserves if needed.
        if (latestDistributedBudgetId[msg.sender] < _budgetId)
            distributeReserves(msg.sender);

        emit TapBudget(
            _budgetId,
            msg.sender,
            _beneficiary,
            _amount,
            stablecoin
        );
    }

    /**
      @notice Collect any funds belonging to you.
      @param _beneficiary The address that will receive the funds.
      @return amount The amount claimed.
     */
    function collect(address _beneficiary)
        external
        override
        lock
        returns (uint256 amount)
    {
        // The amount stashed.
        amount = stashed[msg.sender];

        // Must be positive.
        require(amount > 0, "Juicer::claim: INSUFFICIENT_FUNDS");

        // Set the amount stashed to 0.
        stashed[msg.sender] = 0;

        // Transfer the funds to the specified address.
        stablecoin.safeTransfer(_beneficiary, amount);

        emit Collect(msg.sender, _beneficiary, amount);
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
        overflowYielder.deposit(depositable, stablecoin);
        depositable = 0;

        emit Deposit(depositable, stablecoin);
    }

    /**
        @notice Allows an owner to migrate their Tickets' control to another contract.
        @dev This makes each owner's Ticket's portable.
        @dev Make sure you know what you're doing. This is a one way migration
        @param _to The Juicer contract that will gain minting and burning privileges over the Tickets.
    */
    function migrate(IJuicer _to) external override lock {
        require(
            migrationContractIsAllowed[address(_to)],
            "Juicer:migrateTickets: BAD_DESTINATION"
        );

        // Make sure all reserved tickets and funds have been distributed for this issuer.
        distributeReserves(msg.sender);

        // Get a reference to the owner's Tickets.
        Tickets _tickets = ticketStore.tickets(msg.sender);

        // The owner must have issued Tickets.
        require(_tickets != Tickets(0), "Juicer::migrateTickets: NOT_FOUND");

        // Give the new owner admin privileges.
        _tickets.transferOwnership(address(_to));

        // In order to move funds over, determine the proportion of funds belonging to the message sender.
        uint256 _totalClaimable = ticketStore.totalClaimable();
        uint256 _claimable = ticketStore.clearClaimable(msg.sender);

        // Move all claimable tokens for this issuer.
        // Assumes the new contract uses the same ticket store.
        uint256 _amount =
            (overflowYielder.getBalance(stablecoin).add(depositable))
                .mul(_claimable)
                .div(_totalClaimable);

        // Subtract the depositable amount if needed.
        if (_amount <= depositable) {
            depositable = depositable.sub(_amount);
            // Withdraw from the overflow yielder if there's nothing depositable.
        } else if (depositable == 0) {
            overflowYielder.withdraw(_amount, stablecoin);
            // Withdraw the difference between whats depositable and whats being returned, while setting depositable to 0.
        } else {
            overflowYielder.withdraw(_amount.sub(depositable), stablecoin);
            depositable = 0;
        }

        // Allow the new owner to move funds owned by the issuer from contract.
        stablecoin.safeApprove(address(_to), _amount);
        _to.transferClaimable(msg.sender, _amount, stablecoin);

        emit Migrate(_to, _amount);
    }

    /** 
      @notice Transfer funds from the message sender to this contract that should be designated as overflow for the provided ticket issuer.
      @param _issuer The issuer of the tickets getting credited with overflow.
      @param _amount The amount that the claimable tokens are worth.
      @param _token The token of the specified amount.
    */
    function transferClaimable(
        address _issuer,
        uint256 _amount,
        IERC20 _token
    ) external override {
        // Transfer the specified amount from the msg sender to this contract.
        // The msg sender should have already approved this transfer.
        _token.safeTransferFrom(msg.sender, address(this), _amount);

        uint256 _overflowBefore = depositable;

        // If there is an overflow yielder, deposit to it. Otherwise add to what's depositable.
        if (overflowYielder != IOverflowYielder(0)) {
            _overflowBefore = _overflowBefore.add(
                overflowYielder.getBalance(stablecoin)
            );
            overflowYielder.deposit(_amount, stablecoin);
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
        ticketStore.addClaimable(_issuer, _claimableToAdd);
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
        @param _allowed The contract to allow.
    */
    function allowMigration(address _allowed) external override onlyAdmin {
        migrationContractIsAllowed[_allowed] = true;
        emit AddToMigrationAllowList(_allowed);
    }

    /**
        @notice The admin can set the bonding curve rate.
        @param _rate The new rate.
    */
    function setBondingCurveRate(uint256 _rate) external override onlyAdmin {
        bondingCurveRate = _rate;
        emit SetBondingCurveRate(_rate);
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
            uint256 _amount = overflowYielder.withdrawAll(stablecoin);
            _newOverflowYielder.deposit(_amount, stablecoin);
        }

        // Allow the new overflow yielder to move funds from this contract.
        stablecoin.safeApprove(address(_newOverflowYielder), uint256(-1));
        overflowYielder = _newOverflowYielder;

        emit SetOverflowYielder(_newOverflowYielder);
    }

    // --- public transactions --- //

    /**
        @notice Pays admin fees, donates to beneficiaries, and mints the amount of unminted tickets that are reserved for owners.
        @dev Reserves are only distributable once a Budget expires.
        @param _issuer The Tickets issuer whos Budgets are being searched for unminted reserved tickets.
    */
    function distributeReserves(address _issuer) public override {
        // Get a reference to the owner's latest Budget.
        Budget.Data memory _budget = budgetStore.getLatestBudget(_issuer);

        // The number of  tickets to mint for the issuer.
        uint256 _mintForIssuer = 0;

        // Get the id of the latest distributed budget for this issuer.
        uint256 _latestDistributedBudgetId = latestDistributedBudgetId[_issuer];

        // Return if the latest budget has been redistributed.
        if (_latestDistributedBudgetId == _budget.id) return;

        // Set new latest distributed budget.
        latestDistributedBudgetId[_issuer] = _budget.id;

        // Iterate sequentially through the owner's Budgets, starting with the latest one.
        // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
        while (_budget.id > 0 && _budget.id > _latestDistributedBudgetId) {
            // If the budget is redistributing, it has unminted reserved tickets.
            if (_budget._state() == Budget.State.Redistributing) {
                // Take fee
                uint256 _feeAmount = _budget.total.mul(fee).div(100);
                stashed[admin] = stashed[admin].add(_feeAmount);

                if (_budget.o > 0) {
                    // The owner gets the budget's owner percentage, if one is specified.
                    _mintForIssuer = _mintForIssuer.add(
                        _budget._weighted(_budget.total, _budget.o)
                    );
                }
                if (_budget.b < 0 && _budget.total > _budget.target) {
                    // Give to beneficiary
                    uint256 _bAmount =
                        _budget.total.sub(_budget.target).mul(_budget.b).div(
                            100
                        );
                    stashed[_budget.bAddress] = stashed[_budget.bAddress].add(
                        _bAmount
                    );
                }
            }

            // Continue the loop with the previous Budget.
            _budget = budgetStore.getBudget(_budget.previous);
        }

        if (_mintForIssuer > 0)
            ticketStore.mint(_issuer, _issuer, _mintForIssuer);

        emit DistributeReserves(msg.sender, _issuer);
    }
}
