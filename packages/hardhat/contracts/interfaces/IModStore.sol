// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IOperatorStore.sol";
import "./IProjects.sol";

enum ModKind {TapAmount, ReservedTickets}

struct Mod {
    address payable beneficiary;
    uint16 percent;
    ModKind kind;
}

interface IModStore {
    event SetMods(
        uint256 indexed projectId,
        address payable[] _beneficiaries,
        uint256[] _percents,
        ModKind[] _kinds
    );

    function projects() external view returns (IProjects);

    function operatorStore() external view returns (IOperatorStore);

    function allMods(uint256 _projectId) external view returns (Mod[] memory);

    function setMods(
        uint256 _projectId,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        ModKind[] memory _kinds
    ) external;
}
