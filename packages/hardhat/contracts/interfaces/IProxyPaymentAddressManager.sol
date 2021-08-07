// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./ITerminalDirectory.sol";
import "./ITicketBooth.sol";
import "./IProxyPaymentAddress.sol";

interface IProxyPaymentAddressManager {

    event Deploy(
        uint256 indexed projectId,
        string memo,
        address indexed caller
    );       

    function terminalDirectory() external returns (ITerminalDirectory);

    function ticketBooth() external returns (ITicketBooth);

    function addressesOf(uint256 _projectId)
        external
        view
        returns (IProxyPaymentAddress[] memory);    

    function deploy(uint256 _projectId, string memory _memo) external returns(address);

}