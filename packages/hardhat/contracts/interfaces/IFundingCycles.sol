// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IPrices.sol";
import "../libraries/FundingCycle.sol";

interface IFundingCycles {
    function latestId(uint256 _project) external view returns (uint256);

    function count() external view returns (uint256);

    function get(uint256 _fundingCycleId)
        external
        view
        returns (FundingCycle.Data memory);

    function getQueued(uint256 _projectId)
        external
        view
        returns (FundingCycle.Data memory);

    function getCurrent(uint256 _projectId)
        external
        view
        returns (FundingCycle.Data memory);

    function configure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved,
        uint256 _reconfigurationDelay,
        uint256 _fee
    ) external returns (FundingCycle.Data memory fundingCycle);

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
}
