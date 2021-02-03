// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITimelockStaking {
    function staked(IERC20 _token, address _staker)
        external
        returns (uint256 _amount);

    function timelocks(
        IERC20 _token,
        uint256 _lockId,
        address _staker
    ) external returns (uint256 _expiry);

    function stake(
        IERC20 _token,
        address _issuer,
        uint256 _amount
    ) external returns (uint256);

    function unstake(
        IERC20 _token,
        address _issuer,
        uint256 _amount
    ) external;

    function setTimelock(
        IERC20 _token,
        uint256 _lockId,
        address _voter,
        uint256 _expiry
    ) external;

    function setController(address _controller) external;
}
