// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IOperatorStore.sol";
import "./IProjects.sol";

struct Mod {
    address payable beneficiary;
    // Optional. Either specify amount or percent (out of 1000).
    uint16 percent;
    uint256 amount;
    uint256 id;
}

interface IModStore {
    event AddMod(
        uint256 indexed projectId,
        uint256 indexed id,
        address indexed beneficiary,
        uint256 amount,
        uint256 percent
    );

    event RemoveMod(uint256 indexed projectId, uint256 indexed id);

    function projects() external view returns (IProjects);

    function operatorStore() external view returns (IOperatorStore);

    function modsId() external view returns (uint256);

    function allMods(uint256 _projectId) external view returns (Mod[] memory);

    function addMod(
        uint256 _projectId,
        address payable _beneficiary,
        uint256 _amount,
        uint256 _percent
    ) external;

    function removeMod(uint256 _projectId, uint256 _id) external;
}
