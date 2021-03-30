// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IPrices.sol";
import "./IBudgetBallot.sol";
import "../libraries/Budget.sol";

interface IBudgetStore {
    function latestBudgetId(uint256 _project) external view returns (uint256);

    function budgetCount() external view returns (uint256);

    function fee() external view returns (uint256);

    function getBudget(uint256 _budgetId)
        external
        view
        returns (Budget.Data memory);

    function getQueuedBudget(uint256 _projectId)
        external
        view
        returns (Budget.Data memory);

    function getCurrentBudget(uint256 _projectId)
        external
        view
        returns (Budget.Data memory);

    function configure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved,
        IBudgetBallot _ballot
    ) external returns (Budget.Data memory budget);

    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _currency,
        uint256 _minReturnedETH,
        uint256 _currentOverflow
    )
        external
        returns (
            uint256 id,
            uint256 convertedEthAmount,
            uint256 adminEthFeeAmount
        );

    function setFee(uint256 _fee) external;
}
