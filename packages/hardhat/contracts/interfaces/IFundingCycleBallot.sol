// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IJuicer.sol";

interface IFundingCycleBallot {
    function isApproved(uint256 _fundingCycleId, uint256 _configured)
        external
        view
        returns (bool);

    function isPending(uint256 _fundingCycleId, uint256 _configured)
        external
        view
        returns (bool);
}
