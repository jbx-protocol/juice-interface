// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IOverflowLender {
    function deposited() external view returns (uint256);

    function getDepositedAmount() external view returns (uint256);

    function getTotalOverflow() external view returns (uint256);

    function recalibrateDeposit() external;
}
