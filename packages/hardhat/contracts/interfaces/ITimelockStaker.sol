// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITimelockStaker {
    function controller() external view returns (address);

    function staked(IERC20 _token, address _staker)
        external
        returns (uint256 amount);

    function timelocks(IERC20 _token, address _staker)
        external
        returns (uint256 expiry);

    function stake(IERC20 _token, uint256 _amount) external;

    function unstake(IERC20 _token, uint256 _amount) external;

    function setTimelock(
        IERC20 _token,
        address _voter,
        uint256 _expiry
    ) external;

    function setController(address _controller) external;
}
