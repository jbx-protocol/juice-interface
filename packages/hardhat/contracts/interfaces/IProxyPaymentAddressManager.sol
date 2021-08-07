// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./ITerminalDirectory.sol";
import "./ITicketBooth.sol";
import "./IProxyPaymentAddress.sol";

interface IDirectPaymentAddressProxyManager {

    event DeployProxyPaymentAddress(
        uint256 indexed projectId,
        string memo,
        address indexed caller
    );       

    function terminalDirectory() external returns (ITerminalDirectory);

    function ticketBooth() external returns (ITicketBooth);

    function deployProxyPaymentAddress(uint256 _projectId) external;

}