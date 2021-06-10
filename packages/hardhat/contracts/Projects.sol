// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IProjects.sol";
import "./libraries/Operations.sol";

// Stores project ownership and identifying information.
contract Projects is ERC721, IProjects, Ownable {
    // --- public properties --- //

    // A running count of project IDs.
    uint256 public override count = 0;

    // Optional mapping for project URIs
    mapping(uint256 => string) public override uri;

    /// @notice The project that each unique handle represents.
    mapping(bytes32 => uint256) public override handleResolver;

    /// @notice The project that each unique handle represents.
    mapping(uint256 => bytes32) public override reverseHandleLookup;

    /// @notice Handles that have been transfered to the specified address.
    mapping(bytes32 => address) public override transferedHandles;

    // Each project's controller addresses.
    mapping(uint256 => address) public override controller;

    /// @notice A contract sotring operator assignments.
    IOperatorStore public immutable override operatorStore;

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
    function exists(uint256 _projectId) external view override returns (bool) {
        return _exists(_projectId);
    }

    /**
        @notice Create a new project.
        @param _owner The owner of the project.
        @param _handle A unique handle for the project.
        @param _uri An ipfs uri to more info about the project. Dont include the leading ipfs://
        @return id The new project's ID.
    */
    function create(
        address _owner,
        bytes32 _handle,
        string calldata _uri
    ) external override returns (uint256 id) {
        // Handle must exist.
        require(_handle.length > 0, "Projects::create: EMPTY_HANDLE");

        // Handle must be unique.
        require(
            handleResolver[_handle] == 0 &&
                (transferedHandles[_handle] == address(0) ||
                    transferedHandles[_handle] == msg.sender),
            "Projects::create: HANDLE_TAKEN"
        );

        count++;
        _safeMint(_owner, count);

        reverseHandleLookup[count] = _handle;
        handleResolver[_handle] = count;

        // Set the sender as the controller.
        controller[count] = msg.sender;

        // Set the URI if one was provided.
        if (bytes(_uri).length > 0) uri[count] = _uri;

        emit Create(count, _owner, _handle, _uri, msg.sender);

        return count;
    }

    /**
      @notice Allows a project owner to set the project's handle.
      @param _projectId The ID of the project.
      @param _handle The new unique handle for the project.
    */
    function setHandle(uint256 _projectId, bytes32 _handle) external override {
        // Get a reference to the project owner.
        address _owner = ownerOf(_projectId);

        // Only a project owner or a specified operator can change its info.
        require(
            msg.sender == _owner ||
                operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    Operations.SetInfo
                ),
            "Projects::setInfo: UNAUTHORIZED"
        );

        // Handle must exist.
        require(_handle.length > 0, "Projects::setInfo: EMPTY_HANDLE");

        // Handle must be unique.
        require(
            (handleResolver[_handle] == 0 ||
                handleResolver[_handle] == _projectId) &&
                (transferedHandles[_handle] == address(0) ||
                    transferedHandles[_handle] == msg.sender),
            "Projects::setInfo: HANDLE_TAKEN"
        );

        // If the handle is changing, register the change in the resolver.
        handleResolver[reverseHandleLookup[_projectId]] = 0;

        handleResolver[_handle] = _projectId;
        reverseHandleLookup[_projectId] = _handle;

        emit SetHandle(_projectId, _handle, msg.sender);
    }

    /**
      @notice Allows a project owner to set the project's uri.
      @param _projectId The ID of the project.
      @param _uri An ipfs:// link to more info about the project. Don't include the leading ipfs://
    */
    function setUri(uint256 _projectId, string calldata _uri)
        external
        override
    {
        // Get a reference to the project owner.
        address _owner = ownerOf(_projectId);

        // Only a project owner or a specified operator can change its info.
        require(
            msg.sender == _owner ||
                operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    Operations.SetInfo
                ),
            "Projects::setInfo: UNAUTHORIZED"
        );

        // Set the new uri.
        uri[_projectId] = _uri;

        emit SetUri(_projectId, _uri, msg.sender);
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
        bytes32 _newHandle
    ) external override returns (bytes32 _handle) {
        // Get a reference to the project owner.
        address _owner = ownerOf(_projectId);

        // Only a project owner or a specified operator can transfer its handle.
        require(
            msg.sender == _owner ||
                operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    Operations.TransferHandle
                ) ||
                // The contract's owner can transfer a handle also.
                msg.sender == owner(),
            "Projects::transferHandle: UNAUTHORIZED"
        );
        require(
            _newHandle.length > 0,
            "Projects::transferHandle: EMPTY_HANDLE"
        );

        require(
            handleResolver[_newHandle] == 0,
            "Projects::transferHandle: HANDLE_TAKEN"
        );

        // Get a reference to the project's currency handle.
        _handle = reverseHandleLookup[_projectId];

        // Remove the resolver for the transfered handle.
        handleResolver[_handle] = 0;

        // If the handle is changing, register the change in the resolver.
        handleResolver[_newHandle] = _projectId;
        reverseHandleLookup[_projectId] = _newHandle;

        // Transfer the current handle.
        transferedHandles[_handle] = _to;

        emit TransferHandle(_projectId, _to, _handle, _newHandle, msg.sender);
    }

    /**
      @notice Allows an address to claim and handle that has been transfered to them and apply it to a project of theirs.
      @param _handle The handle being claimed.
      @param _for The address that the handle has been transfered to.
      @param _projectId The ID of the project to use the claimed handle.
    */
    function claimHandle(
        bytes32 _handle,
        address _for,
        uint256 _projectId
    ) external override {
        // Only an account or a specified operator of level 2 or higher can claim a handle.
        require(
            msg.sender == _for ||
                // Allow personal operators (setting projectId to 0), or operators of the specified project.
                operatorStore.hasPermission(
                    _for,
                    _projectId,
                    msg.sender,
                    Operations.ClaimHandle
                ) ||
                operatorStore.hasPermission(
                    _for,
                    0,
                    msg.sender,
                    Operations.ClaimHandle
                ),
            "Projects::transferHandle: UNAUTHORIZED"
        );

        // Get a reference to the project owner.
        address _owner = ownerOf(_projectId);

        // Only a project owner or a specified operator of level 2 or higher can set its handle.
        require(
            msg.sender == _owner ||
                operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    Operations.ClaimHandle
                ),
            "Projects::transferHandle: UNAUTHORIZED"
        );

        // The handle must have been transfered to the specified address.
        require(
            transferedHandles[_handle] == _for,
            "Projects::claimHandle: UNAUTHORIZED"
        );

        // Register the change in the resolver.
        handleResolver[_handle] = _projectId;

        // Set the new handle.
        reverseHandleLookup[_projectId] = _handle;

        emit ClaimHandle(_for, _projectId, _handle, msg.sender);
    }

    /** 
      @notice 
      Transfers the power that can print and redeem tickets on a project's behalf.

      @param _controller The controller to transfer to.
      @param _projectId The ID of the project that will be controlled.
    */
    function transferController(address _controller, uint256 _projectId)
        external
        override
    {
        // The message sender must already be a controller of the project.
        require(
            controller[_projectId] == msg.sender,
            "Tickets::transferController: UNAUTHORIZED"
        );

        // Nothing to do if transfering to the same controller.
        require(
            _controller != msg.sender,
            "Tickets::transferController: NO_OP"
        );

        // Set the controller status.
        controller[_projectId] = _controller;

        emit TransferController(_controller, _projectId, msg.sender);
    }
}
