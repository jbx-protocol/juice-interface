// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./libraries/Budget.sol";
import "./interfaces/IBudgetStore.sol";

import "./abstract/Store.sol";

/** 
  @notice An immutable contract to save Budget states.
*/
contract BudgetStore is Store, IBudgetStore {
    using SafeMath for uint256;
    using Budget for Budget.Data;

    // --- private properties --- //

    // The official record of all Budgets ever created.
    mapping(uint256 => Budget.Data) private budgets;

    // Tracks the kinds of tokens an owner has `want`ed relative to their Budget's reward token.
    mapping(address => mapping(IERC20 => mapping(IERC20 => bool)))
        private wantedTokenTracker;

    // The kinds of tokens an owner has `want`ed relative to their Budget's token.
    mapping(address => mapping(IERC20 => IERC20[])) private wantedTokens;

    // --- public properties --- //

    /// @notice A big number to base ticket issuance off of.
    uint256 public constant BUDGET_BASE_WEIGHT = 1E18;

    /// @notice The latest Budget ID for each owner address.
    mapping(address => uint256) public override latestBudgetId;

    /// @notice The total number of Budgets created, which is used for issuing Budget IDs.
    /// @dev Budgets have IDs > 0.
    uint256 public override budgetCount;

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
        @notice The Budget that's next up for an owner and not currently accepting payments.
        @param _owner The owner of the Budget being looked for.
        @return _budget The Budget.
    */
    function getQueuedBudget(address _owner)
        external
        view
        override
        returns (Budget.Data memory)
    {
        Budget.Data memory _sBudget = _standbyBudget(_owner);
        Budget.Data memory _aBudget = _activeBudget(_owner);
        // If there are both active and standby budgets, the standby budget must be queued.
        if (_sBudget.id > 0 && _aBudget.id > 0) return _sBudget;
        require(_aBudget.id > 0, "BudgetStore::getQueuedBudget: NOT_FOUND");
        return _aBudget._nextUp();
    }

    /**
        @notice The Budget that would be currently accepting sustainments.
        @param _owner The owner of the Budget being looked for.
        @return _budget The Budget.
    */
    function getCurrentBudget(address _owner)
        external
        view
        override
        returns (Budget.Data memory _budget)
    {
        require(
            latestBudgetId[_owner] > 0,
            "BudgetStore::getCurrentBudget: NOT_FOUND"
        );
        _budget = _activeBudget(_owner);
        if (_budget.id > 0) return _budget;
        _budget = _standbyBudget(_owner);
        if (_budget.id > 0) return _budget;
        _budget = budgets[latestBudgetId[_owner]];
        return _budget._nextUp();
    }

    /**
        @notice The Budget that was created most recently for the owner.
        @dev Should not throw.
        @param _owner The owner of the Budget being looked for.
        @return _budget The Budget.
    */
    function getLatestBudget(address _owner)
        external
        view
        override
        returns (Budget.Data memory)
    {
        return budgets[latestBudgetId[_owner]];
    }

    /**
        @notice The amount left to be withdrawn by the Budget's owner.
        @param _budgetId The ID of the Budget to get the available sustainment from.
        @return amount The amount.
    */
    function getTappableAmount(uint256 _budgetId)
        external
        view
        override
        returns (uint256)
    {
        require(
            _budgetId > 0 && _budgetId <= budgetCount,
            "BudgetStore::getTappableAmount:: NOT_FOUND"
        );
        return budgets[_budgetId]._tappableAmount();
    }

    /**
        @notice All tokens that this owner has `want`ed.
        @param _owner The owner to get wanted tokens for.
        @param _rewardToken The token rewarded for the wanted tokens.
        @return _tokens An array of tokens.
    */
    function getWantedTokens(address _owner, IERC20 _rewardToken)
        external
        view
        override
        returns (IERC20[] memory)
    {
        return wantedTokens[_owner][_rewardToken];
    }

    // --- external transactions --- //

    constructor() public {}

    /**
        @notice Tracks the kinds of tokens the specified owner has accepted historically.
        @param _owner The owner associate the token with.
        @param _rewardToken The token that the `want`ed token can be rewarded with.
        @param _token The token to track.
    */
    function trackWantedToken(
        address _owner,
        IERC20 _rewardToken,
        IERC20 _token
    ) external override onlyAdmin {
        if (wantedTokenTracker[_owner][_rewardToken][_token]) return;

        wantedTokens[_owner][_rewardToken].push(_token);
        wantedTokenTracker[_owner][_rewardToken][_token] = true;
    }

    /**
        @notice Cleans the tracking array for an owner and a reward token.
        @dev This is never routinely called, it's here precautionarily in case an owner cycles through several `want` tokens.
        @param _owner The owner of the Tickets responsible for the funds.
        @param _token The tokens to clean accepted tokens for.
    */
    function clearWantedTokens(address _owner, IERC20 _token)
        external
        override
        onlyAdmin
    {
        delete wantedTokens[_owner][_token];
    }

    /**
        @notice Returns the active Budget for this owner if it exists, otherwise activating one appropriately.
        @param _owner The address who owns the Budget to look for.
        @return _budget The resulting Budget.
    */
    function ensureActiveBudget(address _owner)
        external
        override
        onlyAdmin
        returns (Budget.Data memory _budget)
    {
        // Check if there is an active Budget
        _budget = _activeBudget(_owner);
        if (_budget.id > 0) return _budget;
        // No active Budget found, check if there is a standby Budget
        _budget = _standbyBudget(_owner);
        if (_budget.id > 0) return _budget;
        // No upcoming Budget found, clone the latest Budget
        _budget = budgets[latestBudgetId[_owner]];
        require(_budget.id > 0, "BudgetStore::ensureActiveBudget: NOT_FOUND");
        // Use a start date that's a multiple of the duration.
        // This creates the effect that there have been scheduled Budgets ever since the `latest`, even if `latest` is a long time in the past.
        Budget.Data storage _newBudget =
            _initBudget(
                _budget.owner,
                _budget._determineNextStart(),
                _budget._derivedWeight()
            );
        _newBudget._basedOn(_budget);
        return _newBudget;
    }

    /**
        @notice Returns the standby Budget for this owner if it exists, otherwise putting one in standby appropriately.
        @param _owner The address who owns the Budget to look for.
        @return _budget The resulting Budget.
    */
    function ensureStandbyBudget(address _owner)
        external
        override
        onlyAdmin
        returns (Budget.Data memory _budget)
    {
        // Cannot update active moneyPool, check if there is a standby moneyPool
        _budget = _standbyBudget(_owner);
        if (_budget.id > 0) return _budget;
        _budget = budgets[latestBudgetId[_owner]];
        // If there's an active Budget, its end time should correspond to the start time of the new Budget.
        Budget.Data memory _aBudget = _activeBudget(_owner);
        Budget.Data storage _newBudget =
            _aBudget.id > 0
                ? _initBudget(
                    _owner,
                    _aBudget.start.add(_aBudget.duration),
                    _aBudget._derivedWeight()
                )
                : _initBudget(_owner, block.timestamp, BUDGET_BASE_WEIGHT);
        if (_budget.id > 0) _newBudget._basedOn(_budget);
        return _newBudget;
    }

    // --- public transactions --- //

    /** 
        @notice Saves a Budget.
        @param _budget The Budget to save.
    */
    function saveBudget(Budget.Data memory _budget) public override onlyAdmin {
        budgets[_budget.id] = _budget;
    }

    // --- private transactions --- //

    /**
        @notice Initializes a Budget to be sustained for the sending address.
        @param _owner The owner of the Budget being initialized.
        @param _start The start time for the new Budget.
        @param _weight The weight for the new Budget.
        @return _newBudget The initialized Budget.
    */
    function _initBudget(
        address _owner,
        uint256 _start,
        uint256 _weight
    ) private returns (Budget.Data storage _newBudget) {
        budgetCount++;
        _newBudget = budgets[budgetCount];
        _newBudget.id = budgetCount;
        _newBudget.owner = _owner;
        _newBudget.start = _start;
        _newBudget.previous = latestBudgetId[_owner];
        _newBudget.weight = _weight;
        _newBudget.total = 0;
        _newBudget.tapped = 0;
        _newBudget.hasMintedReserves = false;
        latestBudgetId[_owner] = budgetCount;
    }

    /**
        @notice An owner's edittable Budget.
        @param _owner The owner of the Budget being looked for.
        @return _budget The standby Budget.
    */
    function _standbyBudget(address _owner)
        private
        view
        returns (Budget.Data memory _budget)
    {
        _budget = budgets[latestBudgetId[_owner]];
        if (_budget.id == 0) return budgets[0];
        // There is no upcoming Budget if the latest Budget is not upcoming
        if (_budget._state() != Budget.State.Standby) return budgets[0];
    }

    /**
        @notice The currently active Budget for an owner.
        @param _owner The owner of the Budget being looked for.
        @return _budget The active Budget.
    */
    function _activeBudget(address _owner)
        public
        view
        returns (Budget.Data memory _budget)
    {
        _budget = budgets[latestBudgetId[_owner]];
        if (_budget.id == 0) return budgets[0];
        // An Active Budget must be either the latest Budget or the
        // one immediately before it.
        if (_budget._state() == Budget.State.Active) return _budget;
        _budget = budgets[_budget.previous];
        if (_budget.id == 0 || _budget._state() != Budget.State.Active)
            return budgets[0];
    }
}
