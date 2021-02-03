// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./interfaces/ITimelockStaker.sol";

/** 
  @notice A contract that can stake tokens, and unstake them if they aren't bound by a timelock.
  @dev Anyone can stake any ERC-20 token, although only some specific tokens are used by the Juice ecosystem.
*/
contract TimelockStaker is ITimelockStaker {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    /// @notice The address that can set staking timelocks.
    address public override controller;

    /// @notice The amount of all tokens currently staked by each address.
    mapping(IERC20 => mapping(address => uint256)) public override staked;

    /// @notice The amount of all tokens currently locked .
    mapping(IERC20 => mapping(uint256 => mapping(address => uint256)))
        public
        override timelocks;

    constructor() public {}

    /**
      @notice Stakes tokens in this contract.
      @param _token The token to stake.
      @param _amount The amount of tokens to stake.
    */
    function stake(IERC20 _token, uint256 _amount) external override {
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

    /**
      @notice Unstakes tokens if they're not timelocked.
      @param _token The token to unstake.
      @param _amount The amount of tokens to unstake.
    */
    function unstake(IERC20 _token, uint256 _amount) external override {
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

    /**
      @notice Sets a timelock for certain staked tokens within which they can't be unstaked.
      @param _token The token to timelock.
      @param _lockId The ID of the timelock.
      @param _staker The staker of the tokens.
      @param _expiry The time when the lock expires.
    */
    function setTimelock(
        IERC20 _token,
        uint256 _lockId,
        address _staker,
        uint256 _expiry
    ) external override {
        require(msg.sender == controller, "Staking::setTimelock: UNAUTHORIZED");
        timelocks[_token][_lockId][_staker] = _expiry;
    }

    /**
      @notice Sets the timelock controller.
      @dev This can only be set once.
      @param _controller The address that can set the timelock.
    */
    function setController(address _controller) external override {
        require(
            controller == address(0),
            "Staking::setController: ALREADY_SET"
        );
        controller = _controller;
    }
}
