// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

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
    // --- private stored properties --- //

    // The number of seconds in a day.
    uint256 private constant SECONDS_IN_YEAR = 31536000;

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

    /// @notice The timestamps when each handle is claimable. A value of 0 means a handle isn't being challenged.
    mapping(bytes32 => uint256) public override challengeExpiryOf;

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
        ERC721("Juicebox project", "JUICEBOX PROJECT")
        Operatable(_operatorStore)
    {}

    /**
        @notice 
        Create a new project.

        @dev 
        Anyone can create a project on an owner's behalf.

        @param _owner The owner of the project.
        @param _handle A unique handle for the project.
        @param _uri An ipfs CID to more info about the project.
        @param _terminal The terminal to set for this project so that it can start receiving payments.

        @return The new project's ID.
    */
    function create(
        address _owner,
        bytes32 _handle,
        string calldata _uri,
        ITerminal _terminal
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

        // Set the project's terminal if needed.
        if (_terminal != ITerminal(address(0)))
            _terminal.terminalDirectory().setTerminal(count, _terminal);

        emit Create(count, _owner, _handle, _uri, _terminal, msg.sender);

        return count;
    }

    /**
      @notice 
      Allows a project owner to set the project's handle.

      @dev 
      Only a project's owner or operator can set its handle.

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

        // Register the change in the resolver.
        projectFor[handleOf[_projectId]] = 0;

        projectFor[_handle] = _projectId;
        handleOf[_projectId] = _handle;

        emit SetHandle(_projectId, _handle, msg.sender);
    }

    /**
      @notice 
      Allows a project owner to set the project's uri.

      @dev 
      Only a project's owner or operator can set its uri.

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

      @dev 
      Only a project's owner or operator can transfer its handle.

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

      @dev 
      Only a project's owner or operator can claim a handle onto it.

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
        // The handle must have been transfered to the specified address,
        // or the handle challange must have expired before being renewed.
        require(
            transferAddressFor[_handle] == _for ||
                (challengeExpiryOf[_handle] > 0 &&
                    block.timestamp > challengeExpiryOf[_handle]),
            "Projects::claimHandle: UNAUTHORIZED"
        );

        // Register the change in the resolver.
        projectFor[handleOf[_projectId]] = 0;

        // Register the change in the resolver.
        projectFor[_handle] = _projectId;

        // Set the new handle.
        handleOf[_projectId] = _handle;

        // Set the handle as not being transfered.
        transferAddressFor[_handle] = address(0);

        // Reset the challenge to 0.
        challengeExpiryOf[_handle] = 0;

        emit ClaimHandle(_for, _projectId, _handle, msg.sender);
    }

    /** 
      @notice
      Allows anyone to challenge a project's handle. After one year, the handle can be claimed by the public if the challenge isn't answered by the handle's project.
      This can be used to make sure a handle belonging to an unattended to project isn't lost forever.

      @param _handle The handle to challenge.
    */
    function challengeHandle(bytes32 _handle) external {
        // No need to challenge a handle that's not taken.
        require(
            projectFor[_handle] > 0,
            "Projects::challenge: HANDLE_NOT_TAKEN"
        );

        // No need to challenge again if a handle is already being challenged.
        require(
            challengeExpiryOf[_handle] == 0,
            "Projects::challenge: HANDLE_ALREADY_BEING_CHALLENGED"
        );

        // The challenge will expire in a year, at which point the handle can be claimed if the challenge hasn't been answered.
        uint256 _challengeExpiry = block.timestamp + SECONDS_IN_YEAR;

        challengeExpiryOf[_handle] = _challengeExpiry;

        emit ChallengeHandle(_handle, _challengeExpiry, msg.sender);
    }

    /** 
      @notice
      Allows a project to renew its handle so it can't be claimed until a year after its challenged again.

      @dev 
      Only a project's owner or operator can renew its handle.

      @param _projectId The ID of the project that current has the handle being renewed.
    */
    function renewHandle(uint256 _projectId)
        external
        requirePermission(
            ownerOf(_projectId),
            _projectId,
            Operations.RenewHandle
        )
    {
        // Get the handle of the project.
        bytes32 _handle = handleOf[_projectId];

        // Reset the challenge to 0.
        challengeExpiryOf[_handle] = 0;

        emit RenewHandle(_handle, _projectId, msg.sender);
    }
}
