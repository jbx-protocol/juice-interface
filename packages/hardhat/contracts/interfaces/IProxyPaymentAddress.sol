// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./IDirectPaymentAddress.sol";
import "./ITerminalDirectory.sol";
import "./ITicketBooth.sol";

interface IDirectPaymentAddressProxy {

    event ProxyTap(
        address indexed sender,
        address indexed directPaymentAddress,
        uint256 value
    );

    event ProxyTransferTickets(
        address indexed proxyPaymentAddress,
        address indexed terminalDirectory,
        address indexed owner,
        address indexed beneficiary,
        uint256 projectId,
        uint256 amount
    );

    function terminalDirectory() external returns (ITerminalDirectory);

    function ticketBooth() external returns (ITicketBooth);

    function projectId() external returns (uint256);

    function tap() external;

    function transferTickets(address _beneficiary, uint256 _amount) external;

}