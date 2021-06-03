// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IJuicer.sol";

enum BallotState {Approved, Active, Failed, Standby}

interface IFundingCycleBallot {
    function duration() external view returns (uint256);

    function state(uint256 _fundingCycleId, uint256 _configured)
        external
        view
        returns (BallotState);
}
