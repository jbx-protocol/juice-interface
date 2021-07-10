// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IJuicer.sol";

// In constructure, give unlimited access for Juicer to take money from this.
interface IYielder {
    function deposited() external view returns (uint256);

    function getCurrentBalance() external view returns (uint256);

    function deposit() external payable;

    function withdraw(uint256 _amount, address payable _beneficiary) external;

    function withdrawAll(address payable _beneficiary)
        external
        returns (uint256);
}
