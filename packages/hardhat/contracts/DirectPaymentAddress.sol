// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IDirectPaymentAddress.sol";
import "./interfaces/ITerminalDirectory.sol";

import "hardhat/console.sol";

/** 
  @notice
  A contract that can receive funds directly and forward to a project's current terminal.
*/
contract DirectPaymentAddress is IDirectPaymentAddress {
    /// @notice The directory to use when resolving which terminal to send the payment to.
    ITerminalDirectory public override terminalDirectory;

    /// @notice The ID of the project to pay when this contract receives funds.
    uint256 public override projectId;

    /// @notice The memo to use when this contract forwards a payment to a terminal.
    string public override memo;

    /** 
      @param _terminalDirectory A directory of a project's current Juice terminal to receive payments in.
      @param _projectId The ID of the project to pay when this contract receives funds.
      @param _memo The memo to use when this contract forwards a payment to a terminal.
    */
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
        address _storedBeneficiary =
            terminalDirectory.beneficiaries(msg.sender);
        // If no beneficiary is configured, use the sender's address.
        address _beneficiary =
            _storedBeneficiary != address(0) ? _storedBeneficiary : msg.sender;

        bool _preferUnstakedTickets =
            terminalDirectory.preferUnstakedTickets(msg.sender);

        terminalDirectory.terminals(projectId).pay{value: msg.value}(
            projectId,
            _beneficiary,
            memo,
            _preferUnstakedTickets
        );

        emit Forward(
            projectId,
            _beneficiary,
            msg.value,
            memo,
            _preferUnstakedTickets
        );
    }
}
