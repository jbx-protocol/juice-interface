// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IProjects is IERC721 {
    struct Identifier {
        string name;
        string handle;
        // lowercase version of the handler.
        string uniqueHandle;
    }

    function handleResolver(string memory _handle)
        external
        returns (uint256 projectId);

    function getIdentifier(uint256 _projectId)
        external
        view
        returns (Identifier memory);

    function create(
        address _owner,
        string memory _name,
        string memory _handle
    ) external returns (uint256 id);

    function setIdentifiers(
        uint256 _projectId,
        string memory _name,
        string memory _handle
    ) external;
}
