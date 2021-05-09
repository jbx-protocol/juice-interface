// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Ticket is IERC20 {
    function migrate(address to) external;

    function print(address _account, uint256 _amount) external;

    function redeem(address _account, uint256 _amount) external;
}
