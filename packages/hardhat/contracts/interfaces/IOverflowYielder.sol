// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IJuicer.sol";

// In constructure, give unlimited access for Juicer to take money from this.
interface IOverflowYielder {
    function juicer() external view returns (IJuicer);

    function getBalance(IERC20 _token) external view returns (uint256);

    function getRate(IERC20 _token) external view returns (uint128);

    function deposit(uint256 _amount, IERC20 _token) external;

    function withdraw(uint256 _amount, IERC20 _token) external;

    function withdrawAll(IERC20 _token)
        external
        returns (uint256 amountEarning);
}
