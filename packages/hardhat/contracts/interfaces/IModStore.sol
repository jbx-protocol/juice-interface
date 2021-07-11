// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./IOperatorStore.sol";
import "./IProjects.sol";
import "./IModAllocator.sol";

struct PaymentMod {
    bool preferUnstaked;
    uint16 percent;
    uint48 lockedUntil;
    address payable beneficiary;
    IModAllocator allocator;
    uint56 projectId;
}

struct TicketMod {
    bool preferUnstaked;
    uint16 percent;
    uint48 lockedUntil;
    address payable beneficiary;
}

interface IModStore {
    event SetPaymentMod(
        uint256 indexed projectId,
        uint256 indexed configuration,
        PaymentMod mods,
        address caller
    );

    event SetTicketMod(
        uint256 indexed projectId,
        uint256 indexed configuration,
        TicketMod mods,
        address caller
    );

    function projects() external view returns (IProjects);

    function paymentModsOf(uint256 _projectId, uint256 _configuration)
        external
        view
        returns (PaymentMod[] memory);

    function ticketModsOf(uint256 _projectId, uint256 _configuration)
        external
        view
        returns (TicketMod[] memory);

    function setPaymentMods(
        uint256 _projectId,
        uint256 _configuration,
        PaymentMod[] memory _mods
    ) external;

    function setTicketMods(
        uint256 _projectId,
        uint256 _configuration,
        TicketMod[] memory _mods
    ) external;
}
