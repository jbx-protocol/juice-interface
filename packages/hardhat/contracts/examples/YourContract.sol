// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../abstract/JuiceProject.sol";

/// @dev This contract is an example of how you can use Juice to fund your own project.
contract YourContract is JuiceProject {
    constructor(IJuiceTerminal _juicer, uint256 _projectId)
        JuiceProject(_juicer, _projectId)
    {}
}
