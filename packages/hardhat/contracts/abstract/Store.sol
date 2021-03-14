// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./../interfaces/IStore.sol";

abstract contract Store is IStore {
    modifier onlyAdmin {
        require(isAdmin[msg.sender], "Store: UNAUTHORIZED");
        _;
    }

    /// @notice The owner who can manage access permissions of this store.
    address public owner;

    mapping(address => bool) public override isAdmin;

    function appointAdmin(address account) external override {
        require(msg.sender == owner, "Store::addAdmin: UNAUTHORIZED");
        isAdmin[account] = true;
    }

    function revokeAdmin(address account) external override {
        require(msg.sender == owner, "Store::addAdmin: UNAUTHORIZED");
        isAdmin[account] = false;
    }

    /**
        @notice Set ownership over this contract if it hasn't yet been claimed.
        @dev This can only be done once.
        @param _owner The address to set as the owner.
    */
    function setOwnership(address _owner) external override {
        require(owner == address(0), "Store::setAdmin: ALREADY_SET");
        owner = _owner;
        isAdmin[_owner] = true;
    }
}
