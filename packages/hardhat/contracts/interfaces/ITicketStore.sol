// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./../Tickets.sol";

interface ITicketStore {
    event Issue(uint256 project, string name, string symbol);

    function tickets(uint256 _project) external view returns (Tickets);

    function claimable(uint256 _project) external view returns (uint256);

    function totalClaimable() external view returns (uint256);

    function getClaimableAmount(
        address _holder,
        uint256 _amount,
        uint256 _project,
        uint256 _proportion
    ) external view returns (uint256);

    function getTicketValue(uint256 _project) external view returns (uint256);

    function issue(
        uint256 _project,
        string memory _name,
        string memory _symbol
    ) external;

    function print(
        uint256 _project,
        address _for,
        uint256 _amount
    ) external;

    function redeem(
        uint256 _project,
        address _holder,
        uint256 _amount,
        uint256 _minReturn,
        uint256 _proportion
    ) external returns (uint256 returnAmount);

    function addClaimable(uint256 _project, uint256 _amount) external;

    function clearClaimable(uint256 _project) external returns (uint256 amount);
}
