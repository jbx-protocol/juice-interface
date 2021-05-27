// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./IOperatorStore.sol";

interface IProjects is IERC721 {
    struct Info {
        bytes32 handle;
        bytes32 link;
    }

    event SetInfo(
        uint256 indexed projectId,
        bytes32 handle,
        bytes32 link,
        address caller
    );

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

    function operatorStore() external view returns (IOperatorStore);

    function handleResolver(bytes32 _handle)
        external
        returns (uint256 projectId);

    function transferedHandles(bytes32 _handle)
        external
        returns (address receiver);

    function getInfo(uint256 _projectId) external view returns (Info memory);

    function getAllProjectInfo(address _owner)
        external
        view
        returns (Info[] memory);

    function create(
        address _owner,
        bytes32 _handle,
        bytes32 _link
    ) external returns (uint256 id);

    function setInfo(
        uint256 _projectId,
        bytes32 _handle,
        bytes32 _link
    ) external;

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
