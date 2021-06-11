// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./../interfaces/IJuiceTerminalUtility.sol";

abstract contract JuiceTerminalUtility is IJuiceTerminalUtility {
    modifier onlyJuiceTerminal(uint256 _projectId) {
        require(
            address(terminalDirectory.terminals(_projectId)) == msg.sender,
            "JuiceTerminalUtility: UNAUTHORIZED"
        );
        _;
    }

    /// @notice The direct deposit terminals.
    IJuiceTerminalDirectory public immutable override terminalDirectory;

    /** 
      @param _terminalDirectory A directory of a project's current Juice terminal to receive payments in.
    */
    constructor(IJuiceTerminalDirectory _terminalDirectory) {
        terminalDirectory = _terminalDirectory;
    }
}
