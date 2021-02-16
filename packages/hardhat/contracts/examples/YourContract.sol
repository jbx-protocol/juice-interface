// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "../abstract/JuiceAdmin.sol";

/// @dev This contract is an example of how you can use Juice to fund your own project.
contract YourContract is JuiceAdmin {
    constructor(
        IJuicer _controller,
        string memory _ticketName,
        string memory _ticketSymbol
    ) public JuiceAdmin(_controller, _ticketName, _ticketSymbol) {}
}
