// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./ITerminalDirectory.sol";
import "./ITicketBooth.sol";

interface IProxyPaymentAddress {

    event ProxyTap(
        address indexed sender,
        uint256 value
    );

    /// TODO: fix indexing.
    event ProxyTransferTickets(
        address indexed proxyPaymentAddress,
        address indexed terminalDirectory,
        address indexed owner,
        address beneficiary,
        uint256 projectId,
        uint256 amount
    );

    function terminalDirectory() external returns (ITerminalDirectory);

    function ticketBooth() external returns (ITicketBooth);

    function projectId() external returns (uint256);

    function memo() external returns (string memory);

    function tap() external;

    function transferTickets(address _beneficiary, uint256 _amount) external;

}