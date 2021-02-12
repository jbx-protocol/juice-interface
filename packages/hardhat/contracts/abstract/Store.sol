// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./../interfaces/IStore.sol";

abstract contract Store is IStore, AccessControl {
    modifier onlyAdmin {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Store: UNAUTHORIZED");
        _;
    }

    /// @notice The owner who can manage access permissions of this store.
    address public owner;

    function DEFAULT_ADMIN_ROLE_() external pure override returns (bytes32) {
        return DEFAULT_ADMIN_ROLE;
    }

    function grantRole_(bytes32 role, address account) external override {
        return grantRole(role, account);
    }

    function revokeRole_(bytes32 role, address account) external override {
        return revokeRole(role, account);
    }

    /**
        @notice Set ownership over this contract if it hasn't yet been claimed.
        @dev This can only be done once.
        @param _owner The address to set as the owner.
    */
    function setOwnership(address _owner) external override {
        require(owner == address(0), "MpStore::setAdmin: ALREADY_SET");
        owner = _owner;
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
    }
}
