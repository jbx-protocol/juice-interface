// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./abstract/Administered.sol";
import "./interfaces/IERC20TicketStore.sol";

/** 
  @notice A token that can be minted in exchange for something.
*/
contract ERC20TicketStore is IERC20TicketStore, Administered {
    mapping(uint256 => IERC20Ticket) public override tickets;

    constructor() public {}

    function set(IERC20Ticket _ticket, uint256 _projectId)
        external
        override
        onlyAdmin
    {
        tickets[_projectId] = _ticket;
    }
}
