// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./../interfaces/IControlled.sol";

abstract contract Controlled is IControlled {
    modifier onlyController(uint256 _projectId) {
        require(
            projects.controller(_projectId) == msg.sender,
            "Controlled: UNAUTHORIZED"
        );
        _;
    }

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /** 
      @param _projects A Projects contract which mints ERC-721's that represent projects that can be controlled.
    */
    constructor(IProjects _projects) {
        projects = _projects;
    }
}
