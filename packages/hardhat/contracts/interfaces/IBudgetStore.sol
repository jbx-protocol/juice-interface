// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./IStore.sol";
import "../libraries/Budget.sol";

interface IBudgetStore is IStore {
    function latestBudgetId(address _owner) external returns (uint256);

    function votes(
        uint256 _budgetId,
        uint256 _configured,
        bool _yay
    ) external returns (uint256);

    function votesByAddress(
        uint256 _budgetId,
        uint256 _configured,
        address _voter
    ) external returns (uint256);

    function budgetCount() external returns (uint256);

    function getBudget(uint256 _budgetId)
        external
        view
        returns (Budget.Data memory);

    function getQueuedBudget(address _owner)
        external
        view
        returns (Budget.Data memory);

    function getCurrentBudget(address _owner)
        external
        view
        returns (Budget.Data memory);

    function getLatestBudget(address _owner)
        external
        view
        returns (Budget.Data memory);

    function getTappableAmount(uint256 _budgetId)
        external
        view
        returns (uint256);

    function getWantedTokens(address _owner, IERC20 _rewardToken)
        external
        view
        returns (IERC20[] memory);

    function trackWantedToken(
        address _owner,
        IERC20 _rewardToken,
        IERC20 _token
    ) external;

    function clearWantedTokens(address _owner, IERC20 _token) external;

    function ensureActiveBudget(address _owner, uint256 _standbyPeriod)
        external
        returns (Budget.Data memory);

    function ensureStandbyBudget(address _owner)
        external
        returns (Budget.Data memory);

    function saveBudget(Budget.Data calldata _budget) external;

    function addVotes(
        uint256 _budgetId,
        uint256 _configured,
        bool _yay,
        address _voter,
        uint256 _amount
    ) external;
}
