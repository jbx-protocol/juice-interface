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
      @param _beneficiaries The addresses being funded from your tapped amount.
      @param _percents The percents of your target amount to send to the beneficiary of this mod. Out of 1000.
      @param _kinds The kinds of your mods. This can be either TapAmount or ReservedTickets
    */
    function setMods(
        uint256 _projectId,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        ModKind[] memory _kinds
    ) external override {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner, or a delegated operator of level 2 or higher, can add a mod.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                2,
            "Juicer::setMods: UNAUTHORIZED"
        );

        // The params must be of equal lengths.
        require(
            _beneficiaries.length == _percents.length &&
                _beneficiaries.length == _kinds.length,
            "ModStore::setMods: BAD_ARGS"
        );

        delete mods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _percentTotal = 0;

        for (uint256 _i = 0; _i < _beneficiaries.length; _i++) {
            // Either the amount or the percent must be specified.
            require(_percents[_i] > 0, "ModStore::setMods: ZERO_PERCENT");

            // The percent should be less than 1000.
            require(_percents[_i] <= 1000, "ModStore::setMods: BAD_PERCENT");

            // Add to the total percents.
            _percentTotal = _percentTotal + _percents[_i];

            // Push the new mod into the project's list of mods.
            mods[_projectId].push(
                Mod(_beneficiaries[_i], uint16(_percents[_i]), _kinds[_i])
            );
        }

        // The total percent should be less than 1000.
        require(_percentTotal <= 1000, "ModStore::setMods: BAD_PERCENTS");

        emit SetMods(_projectId, _beneficiaries, _percents, _kinds);
    }
}
