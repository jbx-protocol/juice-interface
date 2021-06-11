// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IJuiceTerminalDirectory.sol";

interface IJuiceTerminalUtility {
    function terminalDirectory()
        external
        view
        returns (IJuiceTerminalDirectory);
}
