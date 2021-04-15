// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./abstract/Administered.sol";
import "./interfaces/IProjects.sol";

contract Projects is ERC721, IProjects, Administered {
    // --- private properties --- //

    // A running count of project IDs.
    uint256 private projectId = 0;

    // The info for each project.
    mapping(uint256 => Info) private info;

    // --- public properties --- //

    /// @notice The project that each unique handle represents.
    mapping(bytes => uint256) public override handleResolver;

    /**
        @notice Get the info for a project.
        @param _projectId The ID of the project.
        @return _info The info.
    */
    function getInfo(uint256 _projectId)
        external
        view
        override
        returns (Info memory)
    {
        return info[_projectId];
    }

    constructor() ERC721("Juice project", "JUICE PROJECT") {}

    /**
        @notice Create a new project.
        @param _owner The owner of the project.
        @param _name A name of the project.
        @param _handle A unique handle for the project.
        @param _logoUri A uri to an image representing the project.
        @param _link A link to more info about the project.
        @return id The new project's ID.
    */
    function create(
        address _owner,
        string memory _name,
        string memory _handle,
        string memory _logoUri,
        string memory _link
    ) external override onlyAdmin returns (uint256 id) {
        require(bytes(_handle).length > 0, "Projects::create: EMPTY_HANDLE");
        projectId++;
        _safeMint(_owner, projectId);
        info[projectId] = Info(_name, _handle, _logoUri, _link);
        handleResolver[bytes(_handle)] = projectId;
        return projectId;
    }

    /**
      @notice Allows a project owner to set the project's name and handle.
      @param _projectId The ID of the project.
      @param _name The new name for the project.
      @param _handle The new unique handle for the project.
      @param _logoUri The new uri to an image representing the project.
        @param _link A link to more info about the project.
    */
    function setInfo(
        uint256 _projectId,
        string memory _name,
        string memory _handle,
        string memory _logoUri,
        string memory _link
    ) external override {
        // The message sender must be the project owner.
        require(
            ownerOf(_projectId) == msg.sender,
            "Projects::setInfo: UNAUTHORIZED"
        );
        require(bytes(_handle).length > 0, "Projects::setInfo: EMPTY_HANDLE");

        require(
            handleResolver[bytes(_handle)] == 0,
            "Projects::setInfo: HANDLE_TAKEN"
        );

        // If needed, clear the old handle and set the new one.
        Info memory _info = info[_projectId];

        // If the handle is changing, register the change in the resolver.
        if (keccak256(bytes(_info.handle)) == keccak256(bytes(_handle))) {
            handleResolver[bytes(_info.handle)] = 0;
            handleResolver[bytes(_handle)] = _projectId;
        }

        // Set the new identifier.
        info[_projectId] = Info(_name, _handle, _logoUri, _link);
    }
}
