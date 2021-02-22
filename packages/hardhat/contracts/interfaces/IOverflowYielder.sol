// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IJuicer.sol";

// In constructure, give unlimited access for Juicer to take money from this.
interface IOverflowYielder {
    function juicer() external view returns (IJuicer);

    function deposited() external view returns (uint256);

    function getDepositedAmount() external view returns (uint256);

    function getTotalOverflow() external view returns (uint256);

    function recalibrate() external;
}
