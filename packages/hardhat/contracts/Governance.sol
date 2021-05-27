// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IAdministered.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IPrices.sol";
import "./abstract/JuiceProject.sol";

/// Owner should eventually change to a multisig wallet contract.
contract Governance is JuiceProject {
    constructor(uint256 _projectId)
        JuiceProject(IJuiceTerminal(address(0)), _projectId)
    {}

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
      @notice Sets a new contract that will yield returns on the juicer's funds.
      @param _juicer The juicer to change the yielder of.
      @param _yielder The new yielder.
    */
    function setYielder(IJuicer _juicer, IYielder _yielder) external onlyOwner {
        _juicer.setYielder(_yielder);
    }

    /**
        @notice Allows the admin to transfer handles to/from different projects.
        @dev This power is in place to eventually allow project's to exchange handles on a marketplace.
        @param _projects The projects contract.
        @param _projectId The ID of the project to transfer the handle from.
        @param _to The address that can claim the newly transfered handle.
        @param _newHandle The handle to replace the transfered one with.
    */
    function transferHandle(
        IProjects _projects,
        uint256 _projectId,
        address _to,
        bytes32 _newHandle
    ) external onlyOwner {
        _projects.transferHandle(_projectId, _to, _newHandle);
    }

    /** 
      @notice Sets the target amount of ETH to keep in the Juicer's contract instead of depositing.
      @param _juicer The juicer to change the target local ETH of.
      @param _amount The new target.
    */
    function setTargetLocalETH(IJuicer _juicer, uint256 _amount)
        external
        onlyOwner
    {
        _juicer.setTargetLocalETH(_amount);
    }

    /** 
      @notice Sets the fee of the Juicer.
      @param _juicer The juicer to change the fee of.
      @param _fee The new fee.
    */
    function setFee(IJuicer _juicer, uint256 _fee) external onlyOwner {
        _juicer.setFee(_fee);
    }

    /** 
      @notice Sets the fee of the Juicer.
      @param _juicer The juicer to change the governance of.
      @param _newGovernance The address to appoint as governance.
    */
    function appointGovernance(IJuicer _juicer, address payable _newGovernance)
        external
        onlyOwner
    {
        _juicer.appointGovernance(_newGovernance);
    }
}
