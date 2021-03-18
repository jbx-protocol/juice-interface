// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IStore.sol";
import "./../Tickets.sol";

interface ITicketStore is IStore {
    event Issue(bytes32 project, string name, string symbol);

    function tickets(bytes32 _project) external view returns (Tickets);

    function claimable(bytes32 _project) external view returns (uint256);

    function totalClaimable() external view returns (uint256);

    function iOweYous(bytes32 _project, address _holder)
        external
        view
        returns (uint256);

    function totalIOweYous(bytes32 _project) external view returns (uint256);

    function getClaimableAmount(
        address _holder,
        uint256 _amount,
        bytes32 _project,
        uint256 _proportion
    ) external view returns (uint256);

    function getTicketValue(bytes32 _project) external view returns (uint256);

    function issue(
        bytes32 _project,
        string memory _name,
        string memory _symbol
    ) external;

    function convert(bytes32 _project) external;

    function print(
        bytes32 _project,
        address _for,
        uint256 _amount
    ) external;

    function redeem(
        bytes32 _project,
        address _holder,
        uint256 _amount,
        uint256 _minReturn,
        uint256 _proportion
    ) external returns (uint256 returnAmount);

    function addClaimable(bytes32 _project, uint256 _amount) external;

    function clearClaimable(bytes32 _project) external returns (uint256 amount);
}
