// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IJuicer.sol";
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
            block.timestamp > _configured + reconfigurationDelay
                ? BallotState.Failed
                : BallotState.Active;
    }
}
