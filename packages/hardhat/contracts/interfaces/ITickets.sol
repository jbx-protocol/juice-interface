// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IAccessControlWrapper.sol";

interface ITickets is IERC20, IAccessControlWrapper {
    function rewardToken() external view returns (IERC20);

    function mint(address _account, uint256 _amount) external;

    function burn(address _account, uint256 _amount) external;
}
