// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../abstract/JuiceProject.sol";

/// @dev This contract is an example of how you can use Juice to fund your own project.
contract YourContract is JuiceProject {
    constructor(uint256 _projectId, ITerminalDirectory _directory)
        JuiceProject(_projectId, _directory)
    {}
}
