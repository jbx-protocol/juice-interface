// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IProxyPaymentAddress.sol";
import "./interfaces/ITerminalDirectory.sol";
import "./interfaces/ITicketBooth.sol";

/** 
  @notice
  A contract that can receive funds directly and forward them to a direct payment address.
*/
contract ProxyPaymentAddressProxy is IProxyPaymentAddress, Ownable {
    // --- public immutable stored properties --- //

    /// @notice The directory to use when resolving which terminal to send the payment to.
    ITerminalDirectory public immutable override terminalDirectory;

    /// @notice The ticket booth to use when transferring tickets held by this contract to a beneficiary.
    ITicketBooth public immutable override ticketBooth;

    /// @notice The ID of the project tickets should be redeemed for.
    uint256 public immutable override projectId;

    /// @notice The memo to use when this contract forwards a payment to a terminal.
    string public immutable override memo;

    constructor(
        ITerminalDirectory _terminalDirectory,
        ITicketBooth _ticketBooth,
        uint256 _projectId,
        string _memo
    ) {
        terminalDirectory = _terminalDirectory;
        ticketBooth = _ticketBooth;
        projectId = _projectId;
        memo = _memo;
    }

    // Receive funds and hold them in the contract until they are ready to be transferred.
    receive() external payable { 
      // Do nothing.
    }

    // Transfers all funds held in the contract to the direct payment address.
    function tap() external override {
        uint256 amount = address(this).balance;

        terminalDirectory.terminalOf(projectId).pay{value: amount}(
            projectId,
            address(this),
            memo,
            true // prefer unstaked tickets.
        );

        emit ProxyTap(
            msg.sender,
            address(directPaymentAddress),
            amount
        );     
    }

    /** 
      @notice Transfers tickets held by this contract to a beneficiary.
      @param _beneficiary Address of the beneficiary tickets will be transferred to.
    */
    function transferTickets(address _beneficiary, uint256 _amount) external override onlyOwner {
        address from = address(this);

        ticketBooth.transfer(
            from,
            projectId,
            _amount,
            _beneficiary
        );

        emit ProxyTransferTickets(
            from,
            owner(),
            address(terminalDirectory),
            _beneficiary,
            projectId,
            _amount
        );            
    }

}