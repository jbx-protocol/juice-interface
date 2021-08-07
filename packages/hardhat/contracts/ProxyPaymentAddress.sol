// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IProxyPaymentAddress.sol";
import "./interfaces/ITerminalDirectory.sol";
import "./interfaces/ITicketBooth.sol";

/** 
  @notice
  A contract that can receive and hold funds for a given project.
  Once funds are tapped, tickets are printed and can be transferred out of the contract at a later date.

  Particularly useful for routing funds from third-party platforms (e.g., Open Sea).
*/
contract ProxyPaymentAddress is IProxyPaymentAddress, Ownable {
    // --- public immutable stored properties --- //

    /// @notice The directory to use when resolving which terminal to send the payment to.
    ITerminalDirectory public immutable override terminalDirectory;

    /// @notice The ticket booth to use when transferring tickets held by this contract to a beneficiary.
    ITicketBooth public immutable override ticketBooth;

    /// @notice The ID of the project tickets should be redeemed for.
    uint256 public immutable override projectId;

    /// @notice The memo to use when this contract forwards a payment to a terminal.
    string public override memo;

    constructor(
        ITerminalDirectory _terminalDirectory,
        ITicketBooth _ticketBooth,
        uint256 _projectId,
        string memory _memo
    ) {
        terminalDirectory = _terminalDirectory;
        ticketBooth = _ticketBooth;
        projectId = _projectId;
        memo = _memo;
    }

    // Receive funds and hold them in the contract until they are ready to be transferred.
    receive() external payable { 
        emit Receive(
            msg.sender,
            msg.value
        );
    }

    // Transfers all funds held in the contract to the terminal of the corresponding project.
    function tap() external override {
        uint256 amount = address(this).balance;

        terminalDirectory.terminalOf(projectId).pay{value: amount}(
            projectId,
            /*_beneficiary=*/address(this),
            memo,
            /*_preferUnstakedTickets=*/false
        );

        emit Tap(
            msg.sender,
            amount
        ); 
    }

    /** 
      @notice Transfers tickets held by this contract to a beneficiary.
      @param _beneficiary Address of the beneficiary tickets will be transferred to.
    */
    function transferTickets(address _beneficiary, uint256 _amount) external override onlyOwner {
        ticketBooth.transfer(
            address(this),
            projectId,
            _amount,
            _beneficiary
        );

        emit TransferTickets(
            msg.sender,
            _beneficiary,
            projectId,
            _amount
        );            
    }

}