// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IERC20Ticket.sol";

interface IERC20TicketStore {
    event Issue(
        uint256 indexed projectId,
        string name,
        string symbol,
        address operator
    );

    function tickets(uint256 _projectId) external view returns (IERC20Ticket);

    function isAdmin(uint256 _projectId, address _admin)
        external
        view
        returns (bool);

    function exists(uint256 _projectId) external view returns (bool);

    function issue(
        uint256 _projectId,
        string memory _name,
        string memory _symbol,
        address _admin
    ) external;

    function print(
        address _for,
        uint256 _projectId,
        uint256 _amount
    ) external;

    function redeem(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external;

    function addAdmin(uint256 _projectId, address _admin) external;

    function removeAdmin(uint256 _projectId, address _admin) external;
}
