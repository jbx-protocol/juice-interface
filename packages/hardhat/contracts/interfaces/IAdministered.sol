// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

interface IAdministered {
    function owner() external view returns (address);

    function isAdmin(address account) external returns (bool);

    function appointAdmin(address account) external;

    function revokeAdmin(address account) external;

    function setOwnership(address _owner) external;
}
