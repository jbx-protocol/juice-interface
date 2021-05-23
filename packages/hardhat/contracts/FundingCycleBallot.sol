// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IJuicer.sol";
import "./interfaces/IFundingCycleBallot.sol";

/** 
   @notice Manages votes towards approving funding cycle reconfigurations.
 */
contract FundingCycleBallot is IFundingCycleBallot {
    using FundingCycle for FundingCycle.Data;

    /// @notice The number of seconds that must pass for a funding cycle reconfiguration to become active.
    uint256 public constant reconfigurationDelay = 1209600;

    /// @notice The Juicer for which the budget data is being voted on.
    IJuicer public immutable juicer;

    // --- external views --- //

    /**
      @notice Whether or not a reconfiguration of a particular funding cycle is currently approved.
      @param _configured The configuration of the funding cycle to check the approval of.
      @return Whether or not the funding cycle reconfiguration is currently approved.
   */
    function isApproved(uint256, uint256 _configured)
        external
        view
        override
        returns (bool)
    {
        return block.timestamp > _configured + reconfigurationDelay;
    }

    /**
      @notice Whether or not a reconfiguration of a particular funding cycle is currently pending approval.
      @param _configured The configuration of the funding cycle to check the pending state of.
      @return Whether or not the funding cycle reconfiguration is currently pending approval.
   */
    function isPending(uint256, uint256 _configured)
        external
        view
        override
        returns (bool)
    {
        return block.timestamp <= _configured + reconfigurationDelay;
    }

    // --- external transactions --- //

    /** 
      @param _juicer The Juicer contract that manages to Budgets being voted on.
    */
    constructor(IJuicer _juicer) {
        juicer = _juicer;
    }
}
