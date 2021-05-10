// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IAdministered.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IPrices.sol";
import "./abstract/JuiceProject.sol";

/// All functions in here should be governable with FLOW.
/// Owner should eventually change to a governance contract.
contract Admin is JuiceProject {
    constructor(IJuicer _juicer, address _pm) JuiceProject(_juicer, _pm) {
        // Add the deployer as an operator.
        _juicer.addOperator(msg.sender);
    }

    /** 
      @notice Grants the admin role for a contract that this Admin contract controls.
      @param _contract The contract that is being given access to.
      @param _newAdmin The address that is being given the admin role.
    */
    function grantAdmin(IAdministered _contract, address _newAdmin)
        external
        onlyOwner
    {
        _contract.appointAdmin(_newAdmin);
    }

    /** 
      @notice Revokes the admin role for a contract that this Admin contract controls.
      @param _contract The contract that is having access to revoked.
      @param _oldAdmin The address that is having the admin role revoked.
    */
    function revokeAdmin(IAdministered _contract, address _oldAdmin)
        external
        onlyOwner
    {
        _contract.revokeAdmin(_oldAdmin);
    }

    /** 
      @notice Gives Ticket holders within one Juicer access to migrate to another Juicer.
      @param _from The juicer to allow a new migration from.
      @param _to The juicer to allow migration to.
    */
    function allowMigration(IJuicer _from, address _to) external onlyOwner {
        _from.allowMigration(address(_to));
    }

    /**
        @notice Adds a price feed.
        @param _prices The prices contract to add a feed to.
        @param _feed The price feed to add.
        @param _currency The currency the price feed is for.
    */
    function addPriceFeed(
        IPrices _prices,
        AggregatorV3Interface _feed,
        uint256 _currency
    ) external onlyOwner {
        _prices.addFeed(_feed, _currency);
    }

    /**
        @notice Allows the admin to transfer handles to/from different projects.
        @dev This power is in place to eventually allow project's to exchange handles on a marketplace. 
        @param _juicer The juicer to transfer the handle in.
        @param _projectId The ID of the project to transfer the handle from.
        @param _to The address that can claim the newly transfered handle.
        @param _newHandle The handle to replace the transfered one with.
    */
    function transferHandle(
        IJuicer _juicer,
        uint256 _projectId,
        address _to,
        string memory _newHandle
    ) external onlyOwner {
        _juicer.transferHandle(_projectId, _to, _newHandle);
    }
}
