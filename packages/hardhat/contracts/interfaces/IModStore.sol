// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IOperatorStore.sol";
import "./IProjects.sol";

struct PaymentMod {
    address payable beneficiary;
    uint16 percent;
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

    function setMods(
        uint256 _projectId,
        ModKind[] memory _kinds,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        bool[] memory _preferConvertedTickets
    ) external;

    function setPaymentMods(
        uint256 _projectId,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents
    ) external;

    function setTicketMods(
        uint256 _projectId,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        bool[] memory _preferConvertedTickets
    ) external;
}
