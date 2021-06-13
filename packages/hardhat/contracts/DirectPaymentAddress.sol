// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IDirectPaymentAddress.sol";
import "./interfaces/ITerminalDirectory.sol";

/** 
  @notice
  A contract that can receive funds directly and forward to a project's current terminal.
*/
contract DirectPaymentAddress is IDirectPaymentAddress {
    /// @notice The directory to use when resolving which terminal to send the payment to.
    ITerminalDirectory public override terminalDirectory;

    /// @notice The ID  of the project to pay when this contract receives funds.
    uint256 public override projectId;

    /// @notice The memo to use when this contract forwards a payment to a terminal.
    string public override memo;

    constructor(
        ITerminalDirectory _terminalDirectory,
        uint256 _projectId,
        string memory _memo
    ) {
        terminalDirectory = _terminalDirectory;
        projectId = _projectId;
        memo = _memo;
    }

    // Receive funds and make a payment to the project's current terminal.
    receive() external payable {
        // Check to see if the sender has configured a beneficiary.
        address _beneficiary = terminalDirectory.beneficiaries(msg.sender);
        terminalDirectory.terminals(projectId).pay{value: msg.value}(
            projectId,
            // If no beneficiary is configured, use the sender's address.
            _beneficiary != address(0) ? _beneficiary : msg.sender,
            memo,
            terminalDirectory.preferUnstakedTickets(msg.sender)
        );
    }
}
