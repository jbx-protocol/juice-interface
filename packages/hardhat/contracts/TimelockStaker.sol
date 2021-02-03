// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./interfaces/ITimelockStaker.sol";

contract TimelockStaker is ITimelockStaker {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    /// @notice The address that can set staking timelocks.
    address controller;

    /// @notice The amount of all tokens currently staked by each address.
    mapping(IERC20 => mapping(address => uint256)) public override staked;

    /// @notice The amount of all tokens currently locked .
    mapping(IERC20 => mapping(uint256 => mapping(address => uint256)))
        public
        override timelocks;

    constructor() public {}

    /// @notice The amount of all tokens currently locked .
    function stake(
        IERC20 _token,
        address _issuer,
        uint256 _amount
    ) external override returns (uint256) {
        // The message sender should have more than the amount being staked.
        require(
            _token.balanceOf(msg.sender) >= _amount,
            "stake::stake: INSUFFICIENT_FUNDS"
        );

        // Transfer the funds from the message sender to this address.
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        // Account for the staked tokens.
        staked[_token][msg.sender] = staked[_token][msg.sender].add(_amount);
    }

    function unstake(
        IERC20 _token,
        address _issuer,
        uint256 _amount
    ) external override {
        // Tokens cannot be unstaked if they are locked.
        require(
            staked[_token][msg.sender] < block.timestamp,
            "Staking::unstake: TIME_LOCKED"
        );

        // There must be enough tickets staked to unstake.
        require(
            staked[_token][msg.sender] >= _amount,
            "Staking::unstake: INSUFFICIENT_FUNDS"
        );

        // Account for the difference.
        staked[_token][msg.sender] = staked[_token][msg.sender].sub(_amount);

        // Transfer the token back to the message sender.
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    function setTimelock(
        IERC20 _token,
        uint256 _lockId,
        address _voter,
        uint256 _expiry
    ) external override {
        require(msg.sender == controller, "Staking::setTimelock: UNAUTHORIZED");
        timelocks[_token][_lockId][_voter] = _expiry;
    }

    function setController(address _controller) external override {
        require(
            controller == address(0),
            "Staking::setController: ALREADY_SET"
        );
        controller = _controller;
    }
}
