// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./IDirectPaymentAddress.sol";
import "./ITicketBooth.sol";

interface IDirectPaymentAddressProxy {

    event ProxyForward(
        address indexed payer,
        address indexed directPaymentAddress,
        uint256 value
    );

    event TransferTickets(
        address indexed directPaymentAddressProxy,
        address indexed owner,
        address indexed beneficiary,
        uint256 projectId,
        uint256 amount
    );    

    function directPaymentAddress() external returns (IDirectPaymentAddress);

    function ticketBooth() external returns (ITicketBooth);

    function projectId() external returns (uint256);

    function transferTickets(address _beneficiary) external;

}