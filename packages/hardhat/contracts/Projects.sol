// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./abstract/Operatable.sol";
import "./interfaces/IProjects.sol";

import "./libraries/Operations.sol";

/** 
  @notice 
  Stores project ownership and identifying information.

  @dev
  Projects are represented as ERC-721's.
*/
contract Projects is ERC721, IProjects, Operatable {
    // --- public stored properties --- //

    /// @notice A running count of project IDs.
    uint256 public override count = 0;

    /// @notice Optional mapping for project URIs
    mapping(uint256 => string) public override uriOf;

    /// @notice Each project's handle.
    mapping(uint256 => bytes32) public override handleOf;

    /// @notice The project that each unique handle represents.
    mapping(bytes32 => uint256) public override projectFor;

    /// @notice Handles that have been transfered to the specified address.
    mapping(bytes32 => address) public override transferAddressFor;

    // --- external views --- //

    /** 
      @notice 
      Whether the specified project exists.

      @param _projectId The project to check the existence of.

      @return A flag indicating if the project exists.
    */
    function exists(uint256 _projectId) external view override returns (bool) {
        return _exists(_projectId);
    }

    // --- external transactions --- //

    /** 
      @param _operatorStore A contract storing operator assignments.
    */
    constructor(IOperatorStore _operatorStore)
        ERC721("Juice project", "JUICE PROJECT")
        Operatable(_operatorStore)
    {}

    /**
        @notice 
        Create a new project.

        @param _owner The owner of the project.
        @param _handle A unique handle for the project.
        @param _uri An ipfs uri to more info about the project. Dont include the leading ipfs://

        @return The new project's ID.
    */
    function create(
        address _owner,
        bytes32 _handle,
        string calldata _uri
    ) external override returns (uint256) {
        // Handle must exist.
        require(_handle != bytes32(0), "Projects::create: EMPTY_HANDLE");

        // Handle must be unique.
        require(
            projectFor[_handle] == 0 &&
                transferAddressFor[_handle] == address(0),
            "Projects::create: HANDLE_TAKEN"
        );

        // Increment the count, which will be used as the ID.
        count++;

        // Mint the project.
        _safeMint(_owner, count);

        // Set the handle stored values.
        handleOf[count] = _handle;
        projectFor[_handle] = count;

        // Set the URI if one was provided.
        if (bytes(_uri).length > 0) uriOf[count] = _uri;

        emit Create(count, _owner, _handle, _uri, msg.sender);

        return count;
    }

    /**
      @notice 
      Allows a project owner to set the project's handle.

      @param _projectId The ID of the project.
      @param _handle The new unique handle for the project.
    */
    function setHandle(uint256 _projectId, bytes32 _handle)
        external
        override
        requirePermission(ownerOf(_projectId), _projectId, Operations.SetHandle)
    {
        // Handle must exist.
        require(_handle != bytes32(0), "Projects::setHandle: EMPTY_HANDLE");

        // Handle must be unique.
        require(
            projectFor[_handle] == 0 &&
                transferAddressFor[_handle] == address(0),
            "Projects::setHandle: HANDLE_TAKEN"
        );

        // If the handle is changing, register the change in the resolver.
        projectFor[handleOf[_projectId]] = 0;

        projectFor[_handle] = _projectId;
        handleOf[_projectId] = _handle;

        emit SetHandle(_projectId, _handle, msg.sender);
    }

    /**
      @notice 
      Allows a project owner to set the project's uri.

      @param _projectId The ID of the project.
      @param _uri An ipfs CDN to more info about the project. Don't include the leading ipfs://
    */
    function setUri(uint256 _projectId, string calldata _uri)
        external
        override
        requirePermission(ownerOf(_projectId), _projectId, Operations.SetUri)
    {
        // Set the new uri.
        uriOf[_projectId] = _uri;

        emit SetUri(_projectId, _uri, msg.sender);
    }

    /**
      @notice 
      Allows a project owner to transfer its handle to another address.

      @param _projectId The ID of the project to transfer the handle from.
      @param _to The address that can now reallocate the handle.
      @param _newHandle The new unique handle for the project that will replace the transfered one.
    */
    function transferHandle(
        uint256 _projectId,
        address _to,
        bytes32 _newHandle
    )
        external
        override
        requirePermission(ownerOf(_projectId), _projectId, Operations.SetHandle)
        returns (bytes32 _handle)
    {
        require(
            _newHandle != bytes32(0),
            "Projects::transferHandle: EMPTY_HANDLE"
        );

        require(
            projectFor[_newHandle] == 0 &&
                transferAddressFor[_handle] == address(0),
            "Projects::transferHandle: HANDLE_TAKEN"
        );

        // Get a reference to the project's currency handle.
        _handle = handleOf[_projectId];

        // Remove the resolver for the transfered handle.
        projectFor[_handle] = 0;

        // If the handle is changing, register the change in the resolver.
        projectFor[_newHandle] = _projectId;
        handleOf[_projectId] = _newHandle;

        // Transfer the current handle.
        transferAddressFor[_handle] = _to;

        emit TransferHandle(_projectId, _to, _handle, _newHandle, msg.sender);
    }

    /**
      @notice 
      Allows an address to claim and handle that has been transfered to them and apply it to a project of theirs.

      @param _handle The handle being claimed.
      @param _for The address that the handle has been transfered to.
      @param _projectId The ID of the project to use the claimed handle.
    */
    function claimHandle(
        bytes32 _handle,
        address _for,
        uint256 _projectId
    )
        external
        override
        requirePermissionAllowingWildcardDomain(
            _for,
            _projectId,
            Operations.ClaimHandle
        )
        requirePermission(
            ownerOf(_projectId),
            _projectId,
            Operations.ClaimHandle
        )
    {
        // The handle must have been transfered to the specified address.
        require(
            transferAddressFor[_handle] == _for,
            "Projects::claimHandle: NOT_FOUND"
        );

        // Register the change in the resolver.
        projectFor[_handle] = _projectId;

        // Set the new handle.
        handleOf[_projectId] = _handle;

        // Set the handle as not being transfered.
        transferAddressFor[_handle] = address(0);

        emit ClaimHandle(_for, _projectId, _handle, msg.sender);
    }
}
