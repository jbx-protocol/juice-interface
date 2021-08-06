// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./IDirectPaymentAddress.sol";
import "./ITicketBooth.sol";

interface IDirectPaymentAddressProxy {

    event ProxyTap(
        address indexed sender,
        address indexed directPaymentAddress,
        uint256 value
    );

    event ProxyTransferTickets(
        address indexed directPaymentAddressProxy,
        address indexed owner,
        address indexed beneficiary,
        uint256 projectId,
        uint256 amount
    );    

    function directPaymentAddress() external returns (IDirectPaymentAddress);

    function ticketBooth() external returns (ITicketBooth);

    function projectId() external returns (uint256);

    function tap() external;

    function transferTickets(address _beneficiary, uint256 _amount) external;

}