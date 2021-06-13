// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./ITerminalDirectory.sol";

interface ITerminalUtility {
    function terminalDirectory() external view returns (ITerminalDirectory);
}
