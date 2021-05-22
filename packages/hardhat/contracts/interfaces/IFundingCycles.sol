// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

import "./IPrices.sol";
import "./IFundingCycleBallot.sol";
import "../libraries/FundingCycle.sol";

interface IFundingCycles {
    function latestId(uint256 _project) external view returns (uint256);

    function count() external view returns (uint256);

    function BASE_WEIGHT() external view returns (uint256);

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
        uint256 _fee,
        IFundingCycleBallot _ballot,
        uint256 _metadata,
        bool _configureActiveFundingCycle
    ) external returns (FundingCycle.Data memory);

    function tap(uint256 _projectId, uint256 _amount)
        external
        returns (FundingCycle.Data memory fundingCycle);
}
