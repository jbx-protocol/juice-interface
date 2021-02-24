// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IStore.sol";
import "./../Tickets.sol";

interface ITicketStore is IStore {
    event Issue(address issuer, string name, string symbol);

    function tickets(address _issuer) external view returns (Tickets);

    function claimable(address _issuer) external view returns (uint256);

    function totalClaimable() external view returns (uint256);

    function iOweYous(address _issuer, address _holder)
        external
        view
        returns (uint256);

    function totalIOweYous(address _issuer) external view returns (uint256);

    function getClaimableAmount(
        address _holder,
        uint256 _amount,
        address _issuer,
        uint256 _proportion
    ) external view returns (uint256);

    function getTicketValue(address _issuer) external view returns (uint256);

    function issue(bytes memory _name, bytes memory _symbol) external;

    function convert(address _issuer) external;

    function print(
        address _issuer,
        address _for,
        uint256 _amount
    ) external;

    function redeem(
        address _issuer,
        address _holder,
        uint256 _amount,
        uint256 _minReturn,
        uint256 _proportion
    ) external returns (uint256 returnAmount);

    function addClaimable(address _issuer, uint256 _amount) external;

    function clearClaimable(address _issuer) external returns (uint256 amount);
}
