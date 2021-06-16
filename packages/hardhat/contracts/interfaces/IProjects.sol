// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./IOperatorStore.sol";

interface IProjects is IERC721 {
    struct Info {
        bytes32 handle;
        string uri;
    }

    event Create(
        uint256 indexed projectId,
        address indexed owner,
        bytes32 handle,
        string uri,
        address caller
    );

    event SetHandle(uint256 indexed projectId, bytes32 handle, address caller);

    event SetUri(uint256 indexed projectId, string uri, address caller);

    event TransferHandle(
        uint256 indexed projectId,
        address indexed to,
        bytes32 handle,
        bytes32 newHandle,
        address caller
    );

    event ClaimHandle(
        address indexed account,
        uint256 indexed projectId,
        bytes32 handle,
        address caller
    );

    function count() external view returns (uint256);

    function handleResolver(bytes32 _handle)
        external
        returns (uint256 projectId);

    function reverseHandleLookup(uint256 _projectId)
        external
        returns (bytes32 handle);

    function transferedHandles(bytes32 _handle)
        external
        returns (address receiver);

    function uri(uint256 _projectId) external view returns (string memory);

    function exists(uint256 _projectId) external view returns (bool);

    function create(
        address _owner,
        bytes32 _handle,
        string calldata _uri
    ) external returns (uint256 id);

    function setHandle(uint256 _projectId, bytes32 _handle) external;

    function setUri(uint256 _projectId, string calldata _uri) external;

    function transferHandle(
        uint256 _projectId,
        address _to,
        bytes32 _newHandle
    ) external returns (bytes32 _handle);

    function claimHandle(
        bytes32 _handle,
        address _for,
        uint256 _projectId
    ) external;
}
