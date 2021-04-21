// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IJuicer.sol";

// In constructure, give unlimited access for Juicer to take money from this.
interface IYielder {
    function juicer() external view returns (IJuicer);

    function deposited() external view returns (uint256);

    function getCurrentBalance() external view returns (uint256);

    function deposit(uint256 _amount) external;

    function withdraw(uint256 _amount) external;

    function withdrawAll() external returns (uint256);
}
