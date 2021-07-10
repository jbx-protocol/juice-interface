// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IWETH {
    function decimals() external view returns (uint256);

    function deposit() external payable;

    function withdraw(uint256 wad) external;

    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);
}
