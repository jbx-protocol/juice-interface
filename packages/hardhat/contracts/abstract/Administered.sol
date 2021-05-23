// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./../interfaces/IAdministered.sol";

abstract contract Administered is IAdministered {
    modifier onlyAdmin {
        require(isAdmin[msg.sender], "Administrated: UNAUTHORIZED");
        _;
    }
    modifier onlyOwner {
        require(msg.sender == owner, "Administrated: UNAUTHORIZED");
        _;
    }

    /// @notice The owner who can manage access permissions of this store.
    address public override owner;

    /// @notice A mapping of admins.
    mapping(address => bool) public override isAdmin;

    function appointAdmin(address account) external override onlyOwner {
        isAdmin[account] = true;
    }

    function revokeAdmin(address account) external override onlyOwner {
        isAdmin[account] = false;
    }

    /**
        @notice Set ownership over this contract if it hasn't yet been claimed.
        @dev This can only be done once.
        @param _owner The address to set as the owner.
    */
    function setOwnership(address _owner) external override {
        require(
            owner == address(0),
            "Administrated::setOwnership: ALREADY_SET"
        );
        owner = _owner;
        isAdmin[_owner] = true;
    }
}
