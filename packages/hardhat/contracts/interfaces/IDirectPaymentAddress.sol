// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./ITerminalDirectory.sol";
import "./ITerminal.sol";

interface IDirectPaymentAddress {
    function terminalDirectory() external returns (ITerminalDirectory);

    function projectId() external returns (uint256);

    function memo() external returns (string memory);
}
