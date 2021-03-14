// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IAdminControlWrapper.sol";

interface IAdminControlWrapper {
    function isAdmin(address account) external returns (bool);

    function appointAdmin(address account) external;

    function revokeAdmin(address account) external;
}
