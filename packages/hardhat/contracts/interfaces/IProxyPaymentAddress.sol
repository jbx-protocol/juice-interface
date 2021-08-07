// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./ITerminalDirectory.sol";
import "./ITicketBooth.sol";

interface IProxyPaymentAddress {

    event Receive(
        address indexed caller,
        uint256 value
    );

    event Tap(
        address indexed caller,
        uint256 value
    );

    event TransferTickets(
        address indexed caller,
        address indexed beneficiary,
        uint256 indexed projectId,
        uint256 amount
    );

    function terminalDirectory() external returns (ITerminalDirectory);

    function ticketBooth() external returns (ITicketBooth);

    function projectId() external returns (uint256);

    function memo() external returns (string memory);

    function tap() external;

    function transferTickets(address _beneficiary, uint256 _amount) external;

}