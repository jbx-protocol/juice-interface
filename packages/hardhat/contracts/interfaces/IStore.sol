// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IAdminControlWrapper.sol";

interface IStore is IAdminControlWrapper {
    function setOwnership(address _owner) external;
}
