// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IERC20Ticket.sol";

interface IERC20TicketStore {
    function tickets(uint256 _projectId) external view returns (IERC20Ticket);

    function set(IERC20Ticket _ticket, uint256 _projectId) external;
}
