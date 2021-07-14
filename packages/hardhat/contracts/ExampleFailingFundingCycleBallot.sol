// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./interfaces/ITerminalV1.sol";
import "./interfaces/IFundingCycleBallot.sol";

contract ExampleFailingFundingCycleBallot is IFundingCycleBallot {
    uint256 public constant reconfigurationDelay = 1209600;

    function duration() external pure override returns (uint256) {
        return reconfigurationDelay;
    }

    function state(uint256, uint256 _configured)
        external
        view
        override
        returns (BallotState)
    {
        return
            // Fails halfway through
            block.timestamp > _configured + (reconfigurationDelay / 2)
                ? BallotState.Failed
                : BallotState.Active;
    }
}
