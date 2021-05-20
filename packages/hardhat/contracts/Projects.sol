// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./abstract/Administered.sol";
import "./interfaces/IProjects.sol";

// Stores project ownership and identifying information.
contract Projects is ERC721, IProjects, Administered {
    // --- private properties --- //

    // A running count of project IDs.
    uint256 private projectId = 0;

    // The info for each project.
    mapping(uint256 => Info) private info;

    // --- public properties --- //

    /// @notice The project that each unique handle represents.
    mapping(bytes => uint256) public override handleResolver;

    /// @notice Handles that have been transfered to the specified address.
    mapping(bytes => address) public override transferedHandles;

    /// @notice A contract sotring operator assignments.
    IOperatorStore public immutable override operatorStore;

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

    function getAllProjectInfo(address _owner)
        external
        view
        override
        returns (Info[] memory infos)
    {
        uint256 _balance = balanceOf(_owner);
        infos = new Info[](_balance);
        for (uint256 _i = 0; _i < _balance; _i++)
            infos[_i] = info[tokenOfOwnerByIndex(_owner, _i)];
    }

    constructor(IOperatorStore _operatorStore)
        ERC721("Juice project", "JUICE PROJECT")
    {
        operatorStore = _operatorStore;
    }

    /** 
      @notice Whether the specified project exists.
      @param _projectId The project to check the existence of.
      @return If the project exists.
    */
    function exists(uint256 _projectId) external view returns (bool) {
        return _exists(_projectId);
    }

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
        // Handle must exist.
        require(bytes(_handle).length > 0, "Projects::create: EMPTY_HANDLE");

        // Handle must be unique.
        require(
            handleResolver[bytes(_handle)] == 0 &&
                (transferedHandles[bytes(_handle)] == address(0) ||
                    transferedHandles[bytes(_handle)] == msg.sender),
            "Projects::setInfo: HANDLE_TAKEN"
        );
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
        // Get a reference to the project owner.
        address _owner = ownerOf(_projectId);

        // Only a project owner or a specified operator can change its info.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                4,
            "Projects::setInfo: UNAUTHORIZED"
        );

        // Handle must exist.
        require(bytes(_handle).length > 0, "Projects::setInfo: EMPTY_HANDLE");

        // Handle must be unique.
        require(
            (handleResolver[bytes(_handle)] == 0 ||
                handleResolver[bytes(_handle)] == _projectId) &&
                (transferedHandles[bytes(_handle)] == address(0) ||
                    transferedHandles[bytes(_handle)] == msg.sender),
            "Projects::setInfo: HANDLE_TAKEN"
        );

        // If needed, clear the old handle and set the new one.
        Info storage _info = info[_projectId];

        // If the handle is changing, register the change in the resolver.
        if (keccak256(bytes(_info.handle)) == keccak256(bytes(_handle))) {
            handleResolver[bytes(_info.handle)] = 0;
            handleResolver[bytes(_handle)] = _projectId;
        }

        // Set the new identifier.
        _info.name = _name;
        _info.handle = _handle;
        _info.logoUri = _logoUri;
        _info.link = _link;

        emit SetInfo(_projectId, _name, _handle, _logoUri, _link, msg.sender);
    }

    /**
      @notice Allows a project owner to transfer its handle to another address.
      @param _projectId The ID of the project to transfer the handle from.
      @param _to The address that can now reallocate the handle.
      @param _newHandle The new unique handle for the project that will replace the transfered one.
    */
    function transferHandle(
        uint256 _projectId,
        address _to,
        string memory _newHandle
    ) external override returns (string memory _handle) {
        // Get a reference to the project owner.
        address _owner = ownerOf(_projectId);

        // Only a project owner or a specified operator can transfer its handle.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                4 ||
                // The contract's owner can transfer a handle also.s
                msg.sender == owner,
            "Projects::transferHandle: UNAUTHORIZED"
        );
        require(
            bytes(_newHandle).length > 0,
            "Projects::transferHandle: EMPTY_HANDLE"
        );

        require(
            handleResolver[bytes(_newHandle)] == 0,
            "Projects::transferHandle: HANDLE_TAKEN"
        );

        // If needed, clear the old handle and set the new one.
        Info storage _info = info[_projectId];
        _handle = _info.handle;

        // If the handle is changing, register the change in the resolver.
        handleResolver[bytes(_newHandle)] = _projectId;

        // Remove the resolver for the transfered handle.
        handleResolver[bytes(_handle)] = 0;

        // Transfer the current handle.
        transferedHandles[bytes(_handle)] = _to;

        // Set the new handle.
        _info.handle = _newHandle;

        emit TransferHandle(_projectId, _to, _handle, _newHandle, msg.sender);
    }

    /**
      @notice Allows an address to claim and handle that has been transfered to them and apply it to a project of theirs.
      @param _handle The handle being claimed.
      @param _for The address that the handle has been transfered to.
      @param _projectId The ID of the project to use the claimed handle.
    */
    function claimHandle(
        string memory _handle,
        address _for,
        uint256 _projectId
    ) external override {
        // Only an account or a specified operator of level 2 or higher can claim a handle.
        require(
            msg.sender == _for ||
                // Allow personal operators (setting projectId to 0), or operators of the specified project.
                operatorStore.operatorLevel(_for, _projectId, msg.sender) >=
                2 ||
                operatorStore.operatorLevel(_for, 0, msg.sender) >= 2,
            "Projects::transferHandle: UNAUTHORIZED"
        );

        // Get a reference to the project owner.
        address _owner = ownerOf(_projectId);

        // Only a project owner or a specified operator of level 2 or higher can set its handle.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                2,
            "Projects::transferHandle: UNAUTHORIZED"
        );

        // The handle must have been transfered to the specified address.
        require(
            transferedHandles[bytes(_handle)] == _for,
            "Projects::claimHandle: UNAUTHORIZED"
        );

        // Register the change in the resolver.
        handleResolver[bytes(_handle)] = _projectId;

        // If needed, clear the old handle and set the new one.
        Info storage _info = info[_projectId];

        // Set the new handle.
        _info.handle = _handle;

        emit ClaimHandle(_for, _projectId, _handle, msg.sender);
    }
}
