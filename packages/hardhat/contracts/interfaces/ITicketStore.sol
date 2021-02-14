// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IStore.sol";
import "./../Tickets.sol";

interface ITicketStore is IStore {
    function tickets(address _issuer) external view returns (Tickets);

    function claimable(address _issuer) external view returns (uint256);

    function getClaimableAmount(
        address _holder,
        uint256 _amount,
        address _issuer,
        uint256 _proportion
    ) external view returns (uint256);

    function getTicketValue(address _issuer) external view returns (uint256);

    function saveTickets(address _issuer, Tickets _tickets) external;

    function addClaimable(address _issuer, uint256 _amount) external;

    function subtractClaimable(address _issuer, uint256 _amount) external;
}
