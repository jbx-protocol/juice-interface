// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IModStore.sol";

// Stores mods for each project.
contract ModStore is IModStore {
    // All mods for each project ID.
    mapping(uint256 => Mod[]) private mods;

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable override operatorStore;

    /// @notice the total number of mods.
    uint256 public override count = 0;

    /** 
      @param _projects A Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _operatorStore A contract storing operator assignments.
    */
    constructor(IProjects _projects, IOperatorStore _operatorStore) {
        projects = _projects;
        operatorStore = _operatorStore;
    }

    /**
      @notice Get all mods for the specified prject ID.
      @param _projectId The ID of the project to get mods for.
      @return An array of all mods for the project.
     */
    function allMods(uint256 _projectId)
        external
        view
        override
        returns (Mod[] memory)
    {
        return mods[_projectId];
    }

    /** 
      @notice Adds a mod to the list.
      @param _projectId The project to add a mod to.
      @param _beneficiary The address being funded from your tapped amount.
      @param _amount The amount to send to the beneficiary of this mod. If 0, the percent will be used instead.
      @param _percent The percent of your target amount to send to the beneficiary of this mod. Out of 1000.
    */
    function addMod(
        uint256 _projectId,
        address payable _beneficiary,
        uint256 _amount,
        uint256 _percent
    ) external override {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner, or a delegated operator of level 2 or higher, can add a mod.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                2,
            "Juicer::addMod: UNAUTHORIZED"
        );

        // Either the amount or the percent must be specified.
        require(
            _amount > 0 || _percent > 0,
            "ModStore::addMod: UNSPECIFIED_PORTION"
        );

        // The percent should be less than 1000.
        require(_percent <= 1000, "ModStore::addMod: BAD_PERCENT");

        // Increment the count.
        count++;

        // Push the new mod into the project's list of mods.
        mods[_projectId].push(
            Mod(_beneficiary, uint16(_percent), _amount, count)
        );

        emit AddMod(_projectId, count, _beneficiary, _amount, _percent);
    }

    /** 
      @notice Removes a mod from the list.
      @param _projectId The project to remove a mod from.
      @param _id The id of the mod to remove.
    */
    function removeMod(uint256 _projectId, uint256 _id) external override {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner, or a delegated operator of level 2 or greater, can remove a mod.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                2,
            "Juicer::removeMod: UNAUTHORIZED"
        );

        // Get all of the project's mods into memory.
        Mod[] memory _mods = mods[_projectId];
        // Delete the storage value.
        delete mods[_projectId];
        // Add the non deleted mods into storage.
        for (uint256 _i = 0; _i < _mods.length; _i++)
            if (_mods[_i].id != _id) mods[_projectId].push(_mods[_i]);

        emit RemoveMod(_projectId, _id);
    }
}
