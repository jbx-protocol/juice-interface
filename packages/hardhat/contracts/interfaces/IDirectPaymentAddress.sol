// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IJuiceTerminalDirectory.sol";
import "./IJuiceTerminal.sol";

interface IDirectPaymentAddress {
    function juiceTerminalDirectory()
        external
        returns (IJuiceTerminalDirectory);

    function projectId() external returns (uint256);

    function memo() external returns (string memory);
}
