// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "./IJuicer.sol";

interface IFundingCycleBallot {
    function isApproved(uint256 _budgetId, uint256 _configured)
        external
        view
        returns (bool);

    function isPending(uint256 _fundingCycleId, uint256 _configured)
        external
        view
        returns (bool);
}
