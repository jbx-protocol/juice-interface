// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./IAccessControlWrapper.sol";

interface IStore is IAccessControlWrapper {
    function claimOwnership() external;
}
