// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../abstract/JuiceboxProject.sol";

/// @dev This contract is an example of how you can use Juicebox to fund your own project.
contract YourContract is JuiceboxProject {
    constructor(uint256 _projectId, ITerminalDirectory _directory)
        JuiceboxProject(_projectId, _directory)
    {}
}
