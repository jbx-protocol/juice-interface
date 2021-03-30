// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/Budget.sol";
import "./libraries/DSMath.sol";

import "./interfaces/IBudgetStore.sol";

import "./abstract/Administered.sol";

/** 
  @notice An immutable contract to manage Budget states.
*/
contract BudgetStore is Administered, IBudgetStore {
    using SafeMath for uint256;
    using Budget for Budget.Data;

    // --- private properties --- //

    // The official record of all Budgets ever created.
    mapping(uint256 => Budget.Data) private budgets;

    // --- public properties --- //

    /// @notice The latest Budget ID for each project id.
    mapping(uint256 => uint256) public override latestBudgetId;

    /// @notice The total number of Budgets created, which is used for issuing Budget IDs.
    /// @dev Budgets have IDs > 0.
    uint256 public override budgetCount = 0;

    /// @notice The percent fee the Juice project takes from payments.
    uint256 public override fee = 30;

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
        @param _projectId The ID of the project of the Budget being looked for.
        @return _budget The Budget.
    */
    function getQueuedBudget(uint256 _projectId)
        external
        view
        override
        returns (Budget.Data memory)
    {
        Budget.Data memory _sBudget = _standbyBudget(_projectId);
        Budget.Data memory _aBudget = _activeBudget(_projectId);

        // If there are both active and standby budgets, the standby budget must be queued.
        if (_sBudget.id > 0 && _aBudget.id > 0) return _sBudget;
        require(_aBudget.id > 0, "BudgetStore::getQueuedBudget: NOT_FOUND");
        return _aBudget._nextUp();
    }

    /**
        @notice The Budget that would be currently accepting sustainments for the provided project.
        @param _projectId The ID of the project of the Budget being looked for.
        @return budget The Budget.
    */
    function getCurrentBudget(uint256 _projectId)
        external
        view
        override
        returns (Budget.Data memory budget)
    {
        require(
            latestBudgetId[_projectId] > 0,
            "BudgetStore::getCurrentBudget: NOT_FOUND"
        );
        budget = _activeBudget(_projectId);
        if (budget.id > 0) return budget;
        budget = _standbyBudget(_projectId);
        if (budget.id > 0) return budget;
        budget = budgets[latestBudgetId[_projectId]];
        return budget._nextUp();
    }

    // --- external transactions --- //

    constructor() {}

    /**
        @notice Configures the sustainability target and duration of the sender's current Budget if it hasn't yet received sustainments, or
        sets the properties of the Budget that will take effect once the current one expires.
        @dev The msg.sender is the project of the budget.
        @param _projectId The ID of the project being configured. Send 0 to configure a new project.
        @param _target The cashflow target to set.
        @param _currency The currency of the target.
        @param _duration The duration to set, measured in seconds.
        @param _discountRate A number from 95-100 indicating how valuable a contribution to the current Budget is 
        compared to the project's previous Budget.
        If it's 100, each Budget will have equal weight.
        If it's 95, each Money pool will be 95% as valuable as the previous Money pool's weight.
        @param _bondingCurveRate The rate that describes the bonding curve at which overflow can be claimed.
        @param _reserved The percentage of this Budget's overflow to reserve for the project.
        @param _ballot The ballot to use for reconfiguration voting.
        @return budget The budget that was successfully configured.
    */
    function configure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved,
        IBudgetBallot _ballot
    ) external override onlyAdmin returns (Budget.Data memory budget) {
        // Return's the project's editable budget. Creates one if one doesn't already exists.
        Budget.Data storage _budget = _ensureStandbyBudget(_projectId);

        // Set the properties of the budget.
        _budget.target = _target;
        _budget.duration = _duration;
        _budget.currency = _currency;
        _budget.discountRate = _discountRate;
        _budget.bondingCurveRate = _bondingCurveRate;
        _budget.reserved = _reserved;
        _budget.fee = fee;
        _budget.configured = block.timestamp;
        _budget.ballot = _ballot;

        // Return the budget.
        budget = _budget;
    }

    /** 
      @notice Tracks a project tapping its funds.
      @param _projectId The ID of the project being tapped.
      @param _amount The amount of being tapped.
      @param _currency The currency of the amount.
      @param _currentOverflow The current amount of overflow the project has.
      @param _ethPrice The current price of ETH.
      @return id The ID of the budget that was tapped.
      @return convertedEthAmount The amount of eth tapped.
      @return feeAmount The amount of eth that should be charged as a fee.
    */
    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _currency,
        uint256 _currentOverflow,
        uint256 _ethPrice
    )
        external
        override
        onlyAdmin
        returns (
            uint256 id,
            uint256 convertedEthAmount,
            uint256 feeAmount
        )
    {
        // Get a reference to the Budget being tapped.
        Budget.Data storage _budget = _ensureActiveBudget(_projectId);

        require(
            _currency == _budget.currency,
            "BudgetStore::tap: UNEXPECTED_CURRENCY"
        );

        // Tap the amount.
        convertedEthAmount = _budget._tap(
            _amount,
            _ethPrice,
            // The budget can tap from the project's overflow.
            _currentOverflow
        );

        // The amount that should be charged to the admin.
        feeAmount = Math.mulDiv(convertedEthAmount, 1000, _budget.fee).sub(
            convertedEthAmount
        );

        id = _budget.id;
    }

    /** 
      @notice Sets the percent fee that a budget can have.
      @param _fee The new percent fee.
    */
    function setFee(uint256 _fee) external override onlyAdmin {
        fee = _fee;
    }

    // --- private transactions --- //

    /**
        @notice Returns the standby Budget for this project if it exists, otherwise putting one in standby appropriately.
        @param _projectId The ID of the project to which the Budget being looked for belongs.
        @return budget The resulting Budget.
    */
    function _ensureStandbyBudget(uint256 _projectId)
        private
        returns (Budget.Data storage budget)
    {
        // Cannot update active budget, check if there is a standby budget.
        budget = _standbyBudget(_projectId);
        if (budget.id > 0) return budget;
        // Get the latest budget.
        budget = budgets[latestBudgetId[_projectId]];
        // If there's an active Budget, its end time should correspond to the start time of the new Budget.
        Budget.Data memory _aBudget = _activeBudget(_projectId);

        // Make sure the budget is recurring.
        require(
            _aBudget.id == 0 || _aBudget.discountRate > 0,
            "BudgetStore::_ensureStandbyBudget: NON_RECURRING"
        );

        //Base a new budget on the latest budget if one exists.
        budget = _aBudget.id > 0
            ? _initBudget(
                _projectId,
                _aBudget.start.add(_aBudget.duration),
                budget
            )
            : _initBudget(_projectId, block.timestamp, budget);
    }

    /**
        @notice Returns the active Budget for this project if it exists, otherwise activating one appropriately.
        @param _projectId The ID of the project to which the Budget being looked for belongs.
        @return budget The resulting Budget.
    */
    function _ensureActiveBudget(uint256 _projectId)
        private
        returns (Budget.Data storage budget)
    {
        // Check if there is an active Budget.
        budget = _activeBudget(_projectId);
        if (budget.id > 0) return budget;
        // No active Budget found, check if there is a standby Budget.
        budget = _standbyBudget(_projectId);
        // Budget if exists, has been in standby for enough time, and has more yay votes than nay, return it.
        // The first budget doesn't have a previous to get a ballot from.
        if (
            budget.id > 1 && budgets[budget.previous]._isConfigurationApproved()
        ) return budget;
        // No upcoming Budget found with a successful vote, clone the latest active Budget.
        // Use the standby Budget's previous budget if it exists but doesn't meet activation criteria.
        budget = budgets[
            budget.id > 0 ? budget.previous : latestBudgetId[_projectId]
        ];
        // Budgets with a discountRate of 0 are non-recurring.
        require(
            budget.id > 0 && budget.discountRate > 0,
            "BudgetStore::ensureActiveBudget: NOT_FOUND"
        );
        // Use a start date that's a multiple of the duration.
        // This creates the effect that there have been scheduled Budgets ever since the `latest`, even if `latest` is a long time in the past.
        budget = _initBudget(_projectId, budget._determineNextStart(), budget);
    }

    /**
        @notice Initializes a Budget to be sustained for the sending address.
        @param _projectId The ID of the project to which the Budget being initialized belongs.
        @param _start The start time for the new Budget.
        @param _latestBudget The latest budget for the project.
        @return newBudget The initialized Budget.
    */
    function _initBudget(
        uint256 _projectId,
        uint256 _start,
        Budget.Data storage _latestBudget
    ) private returns (Budget.Data storage newBudget) {
        budgetCount++;
        newBudget = budgets[budgetCount];
        newBudget.id = budgetCount;
        newBudget.start = _start;
        newBudget.tappedTotal = 0;
        newBudget.tappedTarget = 0;
        latestBudgetId[_projectId] = budgetCount;

        if (_latestBudget.id > 0) {
            newBudget._basedOn(_latestBudget);
        } else {
            newBudget.projectId = _projectId;
            newBudget.weight = 10E25;
            newBudget.number = 1;
            newBudget.previous = 0;
        }
    }

    /**
        @notice An project's edittable Budget.
        @param _projectId The ID of project to which the Budget being looked for belongs.
        @return budget The standby Budget.
    */
    function _standbyBudget(uint256 _projectId)
        private
        view
        returns (Budget.Data storage budget)
    {
        budget = budgets[latestBudgetId[_projectId]];
        if (budget.id == 0) return budgets[0];
        // There is no upcoming Budget if the latest Budget is not upcoming
        if (budget._state() != Budget.State.Standby) return budgets[0];
    }

    /**
        @notice The currently active Budget for a project.
        @param _projectId The ID of the project to which the Budget being looked for belongs.
        @return budget The active Budget.
    */
    function _activeBudget(uint256 _projectId)
        private
        view
        returns (Budget.Data storage budget)
    {
        budget = budgets[latestBudgetId[_projectId]];
        if (budget.id == 0) return budgets[0];
        // An Active Budget must be either the latest Budget or the
        // one immediately before it.
        if (budget._state() == Budget.State.Active) return budget;
        budget = budgets[budget.previous];
        if (budget.id == 0 || budget._state() != Budget.State.Active)
            budget = budgets[0];
    }
}
