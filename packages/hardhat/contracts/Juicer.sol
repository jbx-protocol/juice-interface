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
  @notice This contract exposes all external interactions with the Juice ecosystem.
  @dev  1. A project owner issues their Tickets.
        2. A project owner configures their first Budget.
        3. Any address (end user or smart contract) can contribute funds to your Budget.
           You can configure your Budget to `want` any of the tokens on the allow list (DAI, sUSD, ...).
           In return, your contributors receive some of your project's Tickets minted by this contract. 
           They'll receive an amount of Tickets equivalent to a predefined formula that takes into account:
              - The contributed amount. The more someone contributes, the more Tickets they'll receive.
              - The target amount of your Budget. The bigger your Budget's target amount, the fewer tickets that'll be minted for each `want` token contributed.
              - The Budget's weight, which is a number that decreases with each of your Budgets at a configured `discountRate` rate. 
                This rate is called a `discountRate` because it allows you to give out more Tickets to contributors to your 
                current Budget than to future budgets.
        4. As the project owner, you can collect any funds made to your Budget within your configured target.
           Any overflow will be accounted for seperately. 
        5. Your project's Ticket holders can redeem their Tickets for a share of your project's accumulated overflow.
        6. You can reconfigure your Budget at any time with the approval of your Ticket holders, 
           but if your current Budget has already received contribution, the new configuration 
           will only affect your Budget that automatically goes into effect once the current one expires.

  @dev This contract manages all funds.
  
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

    /// @notice The amount of overflow necessary to begin depositing for yield.
    uint256 public constant override DEPOSIT_THRESHOLD = 100000;

    /// @notice The amount of time a Budget must be in standby before it can become active.
    /// @dev This allows for a voting period of 3 days.
    uint256 public constant override RECONFIGURATION_VOTING_PERIOD = 269200;

    /// @notice The admin of the contract who makes admin fees.
    address public override admin;

    /// @notice The contract storing all Budget state variables.
    IBudgetStore public immutable override budgetStore;

    /// @notice The contract that manages the Tickets.
    ITicketStore public immutable override ticketStore;

    /// @notice The contract that puts overflow to work.
    IOverflowYielder public override overflowYielder;

    /// @notice The amount of money that the system must have in overflow before seeking yield.
    uint256 public override depositThreshold = 10000;

    /// @notice The target percent of overflow that should be yielding.
    uint256 public override depositRecalibrationTarget = 682;

    /// @notice The percent fee the contract owner takes from overflow.
    uint256 public immutable override fee;

    /// @notice The amount claimable by each address, including the admin.
    mapping(address => uint256) public override claimable;

    /// @notice The address of a stablecoin ERC-20 token.
    IERC20 public override stablecoin;

    // --- external views --- //

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

        // Iterate sequentially through the owner's Budgets, starting with the latest one.
        // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
        while (_budget.id > 0 && !_budget.hasDistributedReserves) {
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

        // Find the Budget that this contribution should go towards.
        // Creates a new budget based on the owner's most recent one if there isn't currently a Budget accepting contributions.
        (
            Budget.Data memory _budget,
            uint256 _transferAmount,
            uint256 _overflow
        ) =
            budgetStore.payOwner(
                _owner,
                msg.sender,
                _amount,
                RECONFIGURATION_VOTING_PERIOD
            );

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
            ticketStore.addClaimable(
                _budget.owner,
                _contributedOverflow.sub(
                    _contributedOverflow.mul(_budget.b).mul(fee).div(1000)
                )
            );
        }

        // Mint the appropriate amount of tickets for the contributor.
        ticketStore.mint(
            _beneficiary,
            _budget.owner,
            _budget._weighted(_amount, uint256(100).sub(_budget.o).sub(fee))
        );

        emit SustainBudget(
            _budget.id,
            _budget.owner,
            _beneficiary,
            msg.sender,
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
        // Burn the redeemed tickets.
        returnAmount = ticketStore.redeem(
            _issuer,
            msg.sender,
            _amount,
            _minReturn,
            382
        );

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
        if (!_budget.hasDistributedReserves) distributeReserves(msg.sender);

        emit TapBudget(
            _budgetId,
            msg.sender,
            _beneficiary,
            _amount,
            stablecoin
        );
    }

    /**
      @notice Claim any funds belonging to you.
      @return amount The amount claimed.
     */
    function claim() external override lock returns (uint256 amount) {
        amount = claimable[msg.sender];

        require(amount > 0, "Juicer::claim: INSUFFICIENT_FUNDS");

        claimable[msg.sender] = claimable[msg.sender] = 0;

        // Transfer the funds to the specified address.
        stablecoin.safeTransfer(msg.sender, amount);
    }

    /**
        @notice Allows an owner to migrate their Tickets' control to another contract.
        @dev This makes each owner's Ticket's portable.
        @dev Make sure you know what you're doing. This is a one way migration
        @param _to The contract that will gain minting and burning privileges over the Tickets.
    */
    function migrate(address _to) external override lock {
        require(
            migrationContractIsAllowed[_to],
            "Juicer:migrateTickets: BAD_DESTINATION"
        );

        // Get a reference to the owner's Tickets.
        Tickets _tickets = ticketStore.tickets(msg.sender);

        // The owner must have issued Tickets.
        require(_tickets != Tickets(0), "Juicer::migrateTickets: NOT_FOUND");

        // Give the new owner admin privileges.
        _tickets.transferOwnership(_to);

        // Move all claimable tokens for this issuer.
        uint256 _claimable = ticketStore.claimable(msg.sender);

        //TODO set allow limit.
        stablecoin.safeTransfer(_to, _claimable);

        emit Migrate(_to);
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
        @param _contract The contract to allow.
    */
    function addToMigrationAllowList(address _contract)
        external
        override
        onlyAdmin
    {
        migrationContractIsAllowed[_contract] = true;
    }

    /** 
      @notice Allow the admin to change the recallibration target.
      @param _newTarget The new target.
    */
    function setDepositRecalibrationTarget(uint256 _newTarget)
        external
        override
        onlyAdmin
    {
        depositRecalibrationTarget = _newTarget;
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
        //TODO
        // withdraw all funds from the overflowYielder.
        // set the newOverflowYielder.
        // recalibrate.
        overflowYielder = _newOverflowYielder;
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

        // Iterate sequentially through the owner's Budgets, starting with the latest one.
        // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
        while (_budget.id > 0 && !_budget.hasDistributedReserves) {
            // If the budget is redistributing, it has unminted reserved tickets.
            if (_budget._state() == Budget.State.Redistributing) {
                // Take fee
                uint256 _feeAmount = _budget.total.mul(fee).div(100);
                claimable[admin] = claimable[admin].add(_feeAmount);

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
                    claimable[_budget.bAddress] = claimable[_budget.bAddress]
                        .add(_bAmount);
                }

                // Mark the budget as having distributed reserves.
                _budget.hasDistributedReserves = true;

                // Save the budget to the store;
                budgetStore.saveBudget(_budget);
            }

            // Continue the loop with the previous Budget.
            _budget = budgetStore.getBudget(_budget.previous);
        }

        if (_mintForIssuer > 0)
            ticketStore.mint(_issuer, _issuer, _mintForIssuer);

        emit DistributeReserves(msg.sender, _issuer);
    }

    function recalibrate() external {
        //Send funds to the IOverflowYielder that need to be deposit, or withdraw funds that need to be guarded.
        // according to the rate.
    }
}
