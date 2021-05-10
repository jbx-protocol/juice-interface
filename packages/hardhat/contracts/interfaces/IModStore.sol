// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IOperatorStore.sol";
import "./IProjects.sol";

struct Mod {
    uint256 id;
    uint16 percent;
    address payable beneficiary;
}

interface IModStore {
    event AddMod(
        uint256 indexed projectId,
        string handle,
        string name,
        string logoUri,
        string link,
        address operator
    );

    event RemoveMod(
        uint256 indexed projectId,
        address indexed to,
        string handle,
        string newHandle,
        address operator
    );

    function projects() external view returns (IProjects);

    function operatorStore() external view returns (IOperatorStore);

    function modsId() external view returns (uint256);

    function allMods(uint256 _projectId) external view returns (Mod[] memory);

    function addMod(
        uint256 _projectId,
        address payable _beneficiary,
        uint256 _percent
    ) external;

    function removeMod(uint256 _projectId, uint256 _id) external;
}
