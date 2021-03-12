// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IAccessControlWrapper.sol";

interface IStore is IAccessControlWrapper {
    function setOwnership(address _owner) external;
}
