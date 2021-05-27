// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IOperatorStore.sol";
import "./IProjects.sol";

interface IModAllocator {
    event Allocate(
        uint256 indexed projectId,
        uint256 indexed forProjectId,
        address indexed beneficiary,
        uint256 amount,
        string note,
        address caller
    );

    function allocate(
        uint256 _projectId,
        uint256 _forProjectId,
        address _beneficiary,
        string calldata _note
    ) external payable;
}

struct PaymentMod {
    IModAllocator allocator;
    uint256 projectId;
    address payable beneficiary;
    uint16 percent;
    string note;
    bool preferConverted;
}

struct TicketMod {
    address payable beneficiary;
    uint16 percent;
    bool preferConverted;
}

interface IModStore {
    enum ModKind {Payment, Ticket, Both}

    event SetPaymentMods(uint256 indexed projectId, PaymentMod[] mods);

    event SetTicketMods(uint256 indexed projectId, TicketMod[] mods);

    function projects() external view returns (IProjects);

    function operatorStore() external view returns (IOperatorStore);

    function allPaymentMods(uint256 _projectId)
        external
        view
        returns (PaymentMod[] memory);

    function allTicketMods(uint256 _projectId)
        external
        view
        returns (TicketMod[] memory);

    function setPaymentMods(
        uint256 _projectId,
        IModAllocator[] memory _allocators,
        uint256[] memory _forProjectIds,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        string[] memory notes,
        bool[] memory _preferConvertedTickets
    ) external;

    function setTicketMods(
        uint256 _projectId,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        bool[] memory _preferConvertedTickets
    ) external;
}
