// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

interface IAdministered {
    function owner() external view returns (address);

    function isAdmin(address account) external view returns (bool);

    function appointAdmin(address account) external;

    function revokeAdmin(address account) external;

    function setOwnership(address _owner) external;
}
