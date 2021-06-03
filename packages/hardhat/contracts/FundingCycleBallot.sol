// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IJuicer.sol";
import "./interfaces/IFundingCycleBallot.sol";

/** 
   @notice Manages votes towards approving funding cycle reconfigurations.
 */
contract FundingCycleBallot is IFundingCycleBallot {
    /// @notice The number of seconds that must pass for a funding cycle reconfiguration to become active.
    uint256 public constant reconfigurationDelay = 1209600;

    /// @notice The Juicer for which the budget data is being voted on.
    IJuicer public immutable juicer;

    // --- external views --- //

    /** 
      @notice The time that this ballot is active for.
      @dev A ballot should not be considered final until the duration has passed.
      @return The durection in seconds.
    */
    function duration() external pure override returns (uint256) {
        return reconfigurationDelay;
    }

    /**
      @notice The approval state of a particular funding cycle.
      @param _configured The configuration of the funding cycle to check the state of.
      @return The state of the provided ballot.
   */
    function state(uint256, uint256 _configured)
        external
        view
        override
        returns (BallotState)
    {
        return
            block.timestamp > _configured + reconfigurationDelay
                ? BallotState.Approved
                : BallotState.Active;
    }

    // --- external transactions --- //

    /** 
      @param _juicer The Juicer contract that manages to Budgets being voted on.
    */
    constructor(IJuicer _juicer) {
        juicer = _juicer;
    }
}
