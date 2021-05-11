// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./IOperatorStore.sol";

interface IProjects is IERC721 {
    struct Info {
        string name;
        string handle;
        string logoUri;
        string link;
    }

    event SetInfo(
        uint256 indexed projectId,
        string handle,
        string name,
        string logoUri,
        string link,
        address operator
    );

    event TransferHandle(
        uint256 indexed projectId,
        address indexed to,
        string handle,
        string newHandle,
        address operator
    );

    event ClaimHandle(
        address indexed account,
        uint256 indexed projectId,
        string handle,
        address operator
    );

    function operatorStore() external view returns (IOperatorStore);

    function handleResolver(bytes memory _handle)
        external
        returns (uint256 projectId);

    function transferedHandles(bytes memory _handle)
        external
        returns (address receiver);

    function getInfo(uint256 _projectId) external view returns (Info memory);

    function getAllProjectInfo(address _owner)
        external
        view
        returns (Info[] memory);

    function create(
        address _owner,
        string memory _name,
        string memory _handle,
        string memory logoUri,
        string memory link
    ) external returns (uint256 id);

    function setInfo(
        uint256 _projectId,
        string memory _name,
        string memory _handle,
        string memory logoUri,
        string memory link
    ) external;

    function transferHandle(
        uint256 _projectId,
        address _to,
        string memory _newHandle
    ) external returns (string memory _handle);

    function claimHandle(
        string memory _handle,
        address _for,
        uint256 _projectId
    ) external;
}
