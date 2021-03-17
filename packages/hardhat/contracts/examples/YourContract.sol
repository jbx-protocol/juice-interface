// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "../abstract/JuiceProject.sol";

/// @dev This contract is an example of how you can use Juice to fund your own project.
contract YourContract is JuiceProject {
    constructor(
        IJuicer _juicer,
        string memory _ticketName,
        string memory _ticketSymbol,
        address _pm
    ) JuiceProject(_juicer, _ticketName, _ticketSymbol, _pm) {}
}
