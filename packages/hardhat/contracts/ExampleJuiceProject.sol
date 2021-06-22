// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./abstract/JuiceProject.sol";

/// @dev For testing purposes.
contract ExampleJuiceProject is JuiceProject {
    constructor(uint256 _projectId, ITerminalDirectory _terminalDirectory)
        JuiceProject(_projectId, _terminalDirectory)
    {}

    function takeFee(
        uint256 _amount,
        address _beneficiary,
        string calldata _memo,
        bool _preferUnstakedTickets
    ) external {
        _takeFee(_amount, _beneficiary, _memo, _preferUnstakedTickets);
    }
}
