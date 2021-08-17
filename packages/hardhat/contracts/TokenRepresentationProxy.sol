// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./TicketBooth.sol";

/** 
  @notice
  ERC20 wrapper for TicketBooth calls that return both staked + unstaked for a project's token supply.
*/
contract TokenRepresentationProxy is ERC20 {
    ITicketBooth ticketBooth;
    uint256 projectId;

    constructor(
        ITicketBooth _ticketBooth,
        uint256 _projectId,
        string memory name,
        string memory ticker
    ) ERC20(name, ticker) {
        ticketBooth = _ticketBooth;
        projectId = _projectId;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return ticketBooth.totalSupplyOf(projectId);
    }

    function balanceOf(address _account) public view virtual override returns (uint256) {
        return ticketBooth.balanceOf(_account, projectId);
    }
}