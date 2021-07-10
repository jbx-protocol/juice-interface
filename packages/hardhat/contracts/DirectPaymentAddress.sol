// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./interfaces/IDirectPaymentAddress.sol";
import "./interfaces/ITerminalDirectory.sol";

/** 
  @notice
  A contract that can receive funds directly and forward to a project's current terminal.
*/
contract DirectPaymentAddress is IDirectPaymentAddress {
    // --- public immutable stored properties --- //

    /// @notice The directory to use when resolving which terminal to send the payment to.
    ITerminalDirectory public immutable override terminalDirectory;

    /// @notice The ID of the project to pay when this contract receives funds.
    uint256 public immutable override projectId;

    // --- public stored properties --- //

    /// @notice The memo to use when this contract forwards a payment to a terminal.
    string public override memo;

    // --- external transactions --- //

    /** 
      @param _terminalDirectory A directory of a project's current Juicebox terminal to receive payments in.
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
        address _storedBeneficiary = terminalDirectory.beneficiaryOf(
            msg.sender
        );
        // If no beneficiary is configured, use the sender's address.
        address _beneficiary = _storedBeneficiary != address(0)
            ? _storedBeneficiary
            : msg.sender;

        bool _preferUnstakedTickets = terminalDirectory
        .unstakedTicketsPreferenceOf(msg.sender);

        terminalDirectory.terminalOf(projectId).pay{value: msg.value}(
            projectId,
            _beneficiary,
            memo,
            _preferUnstakedTickets
        );

        emit Forward(
            msg.sender,
            projectId,
            _beneficiary,
            msg.value,
            memo,
            _preferUnstakedTickets
        );
    }
}
