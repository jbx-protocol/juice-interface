// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IOperatorStore.sol";
import "./IProjects.sol";
import "./IModAllocator.sol";

struct PaymentMod {
    IModAllocator allocator;
    address payable beneficiary;
    uint8 percent;
    bool preferConverted;
    uint256 projectId;
    string note;
}

struct TicketMod {
    address payable beneficiary;
    uint8 percent;
    bool preferConverted;
}

interface IModStore {
    enum ModKind {Payment, Ticket, Both}

    event SetPaymentMod(
        uint256 indexed projectId,
        PaymentMod mods,
        address caller
    );

    event SetTicketMod(
        uint256 indexed projectId,
        TicketMod mods,
        address caller
    );

    function projects() external view returns (IProjects);

    function setPaymentModsPermissionIndex() external view returns (uint256);

    function setTicketModsPermissionIndex() external view returns (uint256);

    function paymentMods(uint256 _projectId)
        external
        view
        returns (PaymentMod[] memory);

    function ticketMods(uint256 _projectId)
        external
        view
        returns (TicketMod[] memory);

    function setPaymentMods(uint256 _projectId, PaymentMod[] memory _mods)
        external;

    function setTicketMods(uint256 _projectId, TicketMod[] memory _mods)
        external;
}
