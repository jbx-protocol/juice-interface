// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IDirectPaymentAddress.sol";
import "./interfaces/IJuiceTerminalDirectory.sol";

contract DirectPaymentAddress is IDirectPaymentAddress {
    /// @notice The directory to use when resolving which terminal to send the payment to.
    IJuiceTerminalDirectory public override juiceTerminalDirectory;
    /// @notice The project ID to pay when this contract receives funds.
    uint256 public override projectId;
    /// @notice The memo to use when this contract receives funds.
    string public override memo;

    constructor(
        IJuiceTerminalDirectory _juiceTerminalDirectory,
        uint256 _projectId,
        string memory _memo
    ) {
        juiceTerminalDirectory = _juiceTerminalDirectory;
        projectId = _projectId;
        memo = _memo;
    }

    // Receive funds and make a payment.
    receive() external payable {
        address _beneficiary = juiceTerminalDirectory.beneficiaries(msg.sender);
        juiceTerminalDirectory.terminals(projectId).pay{value: msg.value}(
            projectId,
            _beneficiary != address(0) ? _beneficiary : msg.sender,
            memo,
            juiceTerminalDirectory.preferUnstakedTickets(msg.sender)
        );
    }
}
