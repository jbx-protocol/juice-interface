// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

interface IAccessControlWrapper {
    function DEFAULT_ADMIN_ROLE_() external pure returns (bytes32);

    function grantRole_(bytes32 role, address account) external;

    function revokeRole_(bytes32 role, address account) external;
}
