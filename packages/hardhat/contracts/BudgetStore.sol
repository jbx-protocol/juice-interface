// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./libraries/Budget.sol";
import "./libraries/DSMath.sol";
import "./interfaces/IBudgetStore.sol";

import "./abstract/Store.sol";

/** 
  @notice An immutable contract to manage Budget states.
*/
contract BudgetStore is Store, IBudgetStore {
    using SafeMath for uint256;
    using Budget for Budget.Data;

    // --- private properties --- //

    // The official record of all Budgets ever created.
    mapping(uint256 => Budget.Data) private budgets;

    // --- public properties --- //

    /// @notice The latest Budget ID for each project id.
    mapping(bytes32 => uint256) public override latestBudgetId;

    /// @notice The project that is each address can configure and tap.
    mapping(bytes32 => address) public override projectOwner;

    /// @notice The total number of Budgets created, which is used for issuing Budget IDs.
    /// @dev Budgets have IDs > 0.
    uint256 public override budgetCount = 0;

    /// @notice The prices feeds.
    IPrices public override prices;

    /// @notice The ballot where reconfigure votes are kept.
    IBudgetBallot public override budgetBallot;

    /// @notice The percent fee the Juice project takes from payments.
    uint256 public override fee = 25;

    // --- external views --- //

    /**
        @notice Get the Budget with the given ID.
        @param _budgetId The ID of the Budget to get.
        @return _budget The Budget.
    */
    function getBudget(uint256 _budgetId)
        external
        view
        override
        returns (Budget.Data memory)
    {
        require(
            _budgetId > 0 && _budgetId <= budgetCount,
            "BudgetStore::getBudget: NOT_FOUND"
        );
        return budgets[_budgetId];
    }

    /**
        @notice The Budget that's next up for a project and not currently accepting payments.
        @param _project The project of the Budget being looked for.
        @return _budget The Budget.
    */
    function getQueuedBudget(bytes32 _project)
        external
        view
        override
        returns (Budget.Data memory)
    {
        Budget.Data memory _sBudget = _standbyBudget(_project);
        Budget.Data memory _aBudget = _activeBudget(_project);

        // If there are both active and standby budgets, the standby budget must be queued.
        if (_sBudget.id > 0 && _aBudget.id > 0) return _sBudget;
        require(_aBudget.id > 0, "BudgetStore::getQueuedBudget: NOT_FOUND");
        return _aBudget._nextUp();
    }

    /**
        @notice The Budget that would be currently accepting sustainments for the provided project.
        @param _project The project of the Budget being looked for.
        @return budget The Budget.
    */
    function getCurrentBudget(bytes32 _project)
        external
        view
        override
        returns (Budget.Data memory budget)
    {
        require(
            latestBudgetId[_project] > 0,
            "BudgetStore::getCurrentBudget: NOT_FOUND"
        );
        budget = _activeBudget(_project);
        if (budget.id > 0) return budget;
        budget = _standbyBudget(_project);
        if (budget.id > 0) return budget;
        budget = budgets[latestBudgetId[_project]];
        return budget._nextUp();
    }

    // --- external transactions --- //

    constructor(IPrices _prices) {
        prices = _prices;
    }

    /**
        @notice Configures the sustainability target and duration of the sender's current Budget if it hasn't yet received sustainments, or
        sets the properties of the Budget that will take effect once the current one expires.
        @dev The msg.sender is the project of the budget.
        @param _project The project being configured. Send 0 to configure a new project.
        @param _target The cashflow target to set.
        @param _currency The currency of the target.
        @param _duration The duration to set, measured in seconds.
        @param _name The name of the budget.
        @param _link A link to information about the Budget.
        @param _discountRate A number from 95-100 indicating how valuable a contribution to the current Budget is 
        compared to the project's previous Budget.
        If it's 100, each Budget will have equal weight.
        If it's 95, each Money pool will be 95% as valuable as the previous Money pool's weight.
        @param _bondingCurveRate The rate that describes the bonding curve at which overflow can be claimed.
        @param _reserved The percentage of this Budget's overflow to reserve for the project.
        @return _project The project that was successfully configured.
    */
    function configure(
        bytes32 _project,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string calldata _name,
        string calldata _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved
    ) external override returns (bytes32) {
        require(_target > 0, "BudgetStore::configure: BAD_TARGET");

        // The `discountRate` token must be between 95 and 100.
        require(
            (_discountRate >= 950 && _discountRate <= 1000) ||
                _discountRate == 0,
            "BudgetStore::configure: BAD_DISCOUNT_RATE"
        );
        // The `bondingCurveRate` must be between 0 and 1000.
        require(
            _bondingCurveRate > 0 && _bondingCurveRate <= 1000,
            "BudgetStore::configure BAD_BONDING_CURVE_RATE"
        );

        // The reserved project ticket percentage must be less than or equal to 100.
        require(
            _reserved <= 1000,
            "BudgetStore::configure: BAD_RESERVE_PERCENTAGES"
        );

        // Either the message sender must be the project owner, or there must not yet be a project owner.
        require(
            projectOwner[_project] == msg.sender ||
                projectOwner[_project] == address(0),
            "BudgetStore::configure: UNAUTHORIZED"
        );

        // If this is a new project, create an ID.
        if (projectOwner[_project] == address(0)) {
            // If a project was not passed in, create one.
            if (_project == 0)
                _project = keccak256(
                    abi.encodePacked(msg.sender, block.timestamp)
                );

            // Set the owner.
            projectOwner[_project] = msg.sender;
        }

        // Return's the project's editable budget. Creates one if one doesn't already exists.
        Budget.Data storage _budget = _ensureStandbyBudget(_project);

        // Set the properties of the budget.
        _budget.link = _link;
        _budget.name = _name;
        _budget.target = _target;
        _budget.duration = _duration;
        _budget.currency = _currency;
        _budget.discountRate = _discountRate;
        _budget.bondingCurveRate = _bondingCurveRate;
        _budget.reserved = _reserved;
        _budget.fee = fee;
        _budget.configured = block.timestamp;
        _budget.ballot = budgetBallot;

        emit Configure(
            _budget.id,
            _budget.project,
            _budget.target,
            _budget.currency,
            _budget.duration,
            _budget.name,
            _budget.link,
            _budget.discountRate,
            _budget.bondingCurveRate,
            _budget.reserved
        );

        return _project;
    }

    /** 
      @notice Allows a project owner to transfer the project to another owner.
      @dev This transfers the ability to propose reconfigurations, tap funds, and receive tickets on behalf of the project.
    */
    function transferProjectOwnership(bytes32 _project, address _newOwner)
        external
        override
    {
        require(
            projectOwner[_project] == msg.sender,
            "BudgetStore::transferOwnership: UNAUTHORIZED"
        );
        projectOwner[_project] = _newOwner;

        emit TransferOwnership(_project, msg.sender, _newOwner);
    }

    /** 
      @notice Tracks a payments to the appropriate budget for the project.
      @param _project The project being paid.
      @param _amount The amount being paid.
      @return budget The budget that is being paid.
      @return owner The current owner of the budget being paid.
      @return convertedCurrencyAmount The amount of the target currency that was paid.
      @return overflow The overflow that has now become available as a result of paying.
    */
    function payProject(bytes32 _project, uint256 _amount)
        external
        override
        onlyAdmin
        returns (
            Budget.Data memory budget,
            address owner,
            uint256 convertedCurrencyAmount,
            uint256 overflow
        )
    {
        // Find the Budget that this contribution should go towards.
        // Creates a new budget based on the project's most recent one if there isn't currently a Budget accepting contributions.
        Budget.Data storage _budget = _ensureActiveBudget(_project);

        // Add the amount to the budget.
        (convertedCurrencyAmount, overflow) = _budget._add(
            _amount,
            prices.getETHPrice(_budget.currency)
        );

        // Return the budget.
        budget = _budget;

        //Set the owner.
        owner = projectOwner[_project];
    }

    /** 
      @notice Tracks a project tapping its funds.
      @param _budgetId The ID of the budget being tapped.
      @param _tapper The address that is tapping.
      @param _amount The amount of being tapped.
      @param _currency The currency of the amount being tapped.
      @return budget The budget that is being tapped.
      @return convertedEthAmount The amount of eth tapped.
      @return overflow The overflow that has now become available as a result of tapping.
    */
    function tap(
        uint256 _budgetId,
        address _tapper,
        uint256 _amount,
        uint256 _currency
    )
        external
        override
        onlyAdmin
        returns (
            Budget.Data memory budget,
            uint256 convertedEthAmount,
            uint256 overflow
        )
    {
        // Get a reference to the Budget being tapped.
        Budget.Data storage _budget = budgets[_budgetId];

        require(_budget.id > 0, "BudgetStore::tap: NOT_FOUND");

        // Only a project owner can tap its funds.
        require(
            _tapper == projectOwner[_budget.project],
            "BudgetStore::tap: UNAUTHORIZED"
        );

        // Don't tap budgets with a different currency.
        require(
            _currency == _budget.currency,
            "BudgetStore::tap: BAD_CURRENCY"
        );

        // Tap the amount.
        (convertedEthAmount, overflow) = _budget._tap(
            _amount,
            prices.getETHPrice(_budget.currency)
        );

        // Return the budget.
        budget = _budget;
    }

    /** 
      @notice Sets the minimum percent fee that a budget can have.
      @param _fee The new percent fee.
    */
    function setFee(uint256 _fee) external override onlyAdmin {
        fee = _fee;
    }

    /** 
      @notice Sets the budget ballot contract that will be used for forthcoming budget reconfigurations.
      @param _budgetBallot The new budget ballot.
    */
    function setBudgetBallot(IBudgetBallot _budgetBallot)
        external
        override
        onlyAdmin
    {
        budgetBallot = _budgetBallot;
    }

    // --- private transactions --- //

    /**
        @notice Returns the standby Budget for this project if it exists, otherwise putting one in standby appropriately.
        @param _project The project to which the Budget being looked for belongs.
        @return budget The resulting Budget.
    */
    function _ensureStandbyBudget(bytes32 _project)
        private
        returns (Budget.Data storage budget)
    {
        // Cannot update active budget, check if there is a standby budget.
        budget = _standbyBudget(_project);
        if (budget.id > 0) return budget;
        // Get the latest budget.
        budget = budgets[latestBudgetId[_project]];
        // If there's an active Budget, its end time should correspond to the start time of the new Budget.
        Budget.Data memory _aBudget = _activeBudget(_project);

        // Make sure the budget is recurring.
        require(
            _aBudget.id == 0 || _aBudget.discountRate > 0,
            "BudgetStore::_ensureStandbyBudget: NON_RECURRING"
        );

        //Base a new budget on the latest budget if one exists.
        budget = _aBudget.id > 0
            ? _initBudget(
                _project,
                _aBudget.start.add(_aBudget.duration),
                budget
            )
            : _initBudget(_project, block.timestamp, budget);
    }

    /**
        @notice Returns the active Budget for this project if it exists, otherwise activating one appropriately.
        @param _project The project to which the Budget being looked for belongs.
        @return budget The resulting Budget.
    */
    function _ensureActiveBudget(bytes32 _project)
        private
        returns (Budget.Data storage budget)
    {
        // Check if there is an active Budget.
        budget = _activeBudget(_project);
        if (budget.id > 0) return budget;
        // No active Budget found, check if there is a standby Budget.
        budget = _standbyBudget(_project);
        // Budget if exists, has been in standby for enough time, and has more yay votes than nay, return it.
        if (
            budget.id > 0 &&
            (budget._isConfigurationApproved() ||
                // allow if this is the first budget and it hasn't received payments.
                (budget.number == 1 && budget.total == 0))
        ) return budget;
        // No upcoming Budget found with a successful vote, clone the latest active Budget.
        // Use the standby Budget's previous budget if it exists but doesn't meet activation criteria.
        budget = budgets[
            budget.id > 0 ? budget.previous : latestBudgetId[_project]
        ];
        // Budgets with a discountRate of 0 are non-recurring.
        require(
            budget.id > 0 && budget.discountRate > 0,
            "BudgetStore::ensureActiveBudget: NOT_FOUND"
        );
        // Use a start date that's a multiple of the duration.
        // This creates the effect that there have been scheduled Budgets ever since the `latest`, even if `latest` is a long time in the past.
        budget = _initBudget(_project, budget._determineNextStart(), budget);
    }

    /**
        @notice Initializes a Budget to be sustained for the sending address.
        @param _project The project to which the Budget being initialized belongs.
        @param _start The start time for the new Budget.
        @param _latestBudget The latest budget for the project.
        @return newBudget The initialized Budget.
    */
    function _initBudget(
        bytes32 _project,
        uint256 _start,
        Budget.Data storage _latestBudget
    ) private returns (Budget.Data storage newBudget) {
        budgetCount++;
        newBudget = budgets[budgetCount];
        newBudget.id = budgetCount;
        newBudget.start = _start;
        newBudget.total = 0;
        newBudget.tappedTotal = 0;
        newBudget.tappedTarget = 0;
        latestBudgetId[_project] = budgetCount;

        if (_latestBudget.id > 0) {
            newBudget._basedOn(_latestBudget);
        } else {
            newBudget.project = _project;
            newBudget.weight = 10E25;
            newBudget.number = 1;
            newBudget.previous = 0;
        }
    }

    /**
        @notice An project's edittable Budget.
        @param _project The project to which the Budget being looked for belongs.
        @return budget The standby Budget.
    */
    function _standbyBudget(bytes32 _project)
        private
        view
        returns (Budget.Data storage budget)
    {
        budget = budgets[latestBudgetId[_project]];
        if (budget.id == 0) return budgets[0];
        // There is no upcoming Budget if the latest Budget is not upcoming
        if (budget._state() != Budget.State.Standby) return budgets[0];
    }

    /**
        @notice The currently active Budget for a project.
        @param _project The project to which the Budget being looked for belongs.
        @return budget The active Budget.
    */
    function _activeBudget(bytes32 _project)
        private
        view
        returns (Budget.Data storage budget)
    {
        budget = budgets[latestBudgetId[_project]];
        if (budget.id == 0) return budgets[0];
        // An Active Budget must be either the latest Budget or the
        // one immediately before it.
        if (budget._state() == Budget.State.Active) return budget;
        budget = budgets[budget.previous];
        if (budget.id == 0 || budget._state() != Budget.State.Active)
            budget = budgets[0];
    }
}
