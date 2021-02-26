// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../abstract/JuiceProject.sol";

/// @dev This contract is an example of how you can use Juice to fund your own project.
contract YourContract is JuiceProject {
    constructor(
        string memory _ticketName,
        string memory _ticketSymbol,
        address _pm
    ) public JuiceProject(_ticketName, _ticketSymbol, _pm) {}
}
