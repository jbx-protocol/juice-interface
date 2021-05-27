// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IModStore.sol";
import "./libraries/Operations.sol";

// Stores mods for each project.
contract ModStore is IModStore {
    // All payment mods for each project ID.
    mapping(uint256 => PaymentMod[]) private paymentMods;

    // All ticket mods for each project ID.
    mapping(uint256 => TicketMod[]) private ticketMods;

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable override operatorStore;

    /** 
      @param _projects A Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _operatorStore A contract storing operator assignments.
    */
    constructor(IProjects _projects, IOperatorStore _operatorStore) {
        projects = _projects;
        operatorStore = _operatorStore;
    }

    /**
      @notice Get all payment mods for the specified prject ID.
      @param _projectId The ID of the project to get mods for.
      @return An array of all mods for the project.
     */
    function allPaymentMods(uint256 _projectId)
        external
        view
        override
        returns (PaymentMod[] memory)
    {
        return paymentMods[_projectId];
    }

    /**
      @notice Get all ticket mods for the specified prject ID.
      @param _projectId The ID of the project to get mods for.
      @return An array of all mods for the project.
     */
    function allTicketMods(uint256 _projectId)
        external
        view
        override
        returns (TicketMod[] memory)
    {
        return ticketMods[_projectId];
    }

    /** 
      @notice Adds a mod to the payment mods list.
      @param _projectId The project to add a mod to.
      @param _allocators The contract to send payments to that is in charge of allocating on the project's behalf.
      @param _forProjectIds The IDs of the Juice project to forward to the allocator, or to send payments to on Juice if there is no allocator.
      @param _beneficiaries The addresses to forward to the allocator, or to send the funds to directly if there is no allocator and no project ID.
      @param _percents The percents of total funds to send to each mod.
      @param _notes The notes to forward to the allocator, or use in the payment to a Juice project.
      @param _preferConvertedTickets Whether allocated tickets should attempt to auto claim ERC20s.
    */
    function setPaymentMods(
        uint256 _projectId,
        IModAllocator[] memory _allocators,
        uint256[] memory _forProjectIds,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        string[] memory _notes,
        bool[] memory _preferConvertedTickets
    ) external override {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner, or a delegated operator of level 2 or higher, can add a mod.
        require(
            msg.sender == _owner ||
                operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    Operations.SetPaymentMods
                ),
            "Juicer::setPaymentMods: UNAUTHORIZED"
        );

        // There must be something to do.
        require(_beneficiaries.length > 0, "ModStore::setPaymentMods: NO_OP");

        // The params must be of equal lengths.
        require(
            _beneficiaries.length == _percents.length &&
                _beneficiaries.length == _allocators.length &&
                _beneficiaries.length == _notes.length &&
                _beneficiaries.length == _preferConvertedTickets.length &&
                _beneficiaries.length == _forProjectIds.length,
            "ModStore::setPaymentMods: BAD_ARGS"
        );

        // Delete from storage.
        delete paymentMods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _paymentModPercentTotal = 0;

        for (uint256 _i = 0; _i < _beneficiaries.length; _i++) {
            // The percent should be less than 200.
            require(
                _percents[_i] > 0 && _percents[_i] <= 200,
                "ModStore::setPaymentMods: BAD_PERCENT"
            );

            // Push the new mod into the project's list of mods.
            paymentMods[_projectId].push(
                PaymentMod(
                    _allocators[_i],
                    _forProjectIds[_i],
                    _beneficiaries[_i],
                    uint16(_percents[_i]),
                    _notes[_i],
                    _preferConvertedTickets[_i]
                )
            );
            // Add to the total percents.
            _paymentModPercentTotal = _paymentModPercentTotal + _percents[_i];
        }

        // The total percent should be less than 200.
        require(
            _paymentModPercentTotal <= 200,
            "ModStore::setPaymentMods: BAD_PERCENTS"
        );

        emit SetPaymentMods(_projectId, paymentMods[_projectId]);
    }

    /** 
      @notice Adds a mod to the ticket mods list.
      @param _projectId The project to add a mod to.
      @param _beneficiaries The addresses to send tickets to.
      @param _percents The percents of total tickets to send to each mod.
      @param _preferConvertedTickets Whether allocated tickets should attempt to auto claim ERC20s.
    */
    function setTicketMods(
        uint256 _projectId,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        bool[] memory _preferConvertedTickets
    ) external override {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner, or a delegated operator of level 2 or higher, can add a mod.
        require(
            msg.sender == _owner ||
                operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    Operations.SetTicketMods
                ),
            "ModStore::setTicketMods: UNAUTHORIZED"
        );

        // There must be something to do.
        require(_beneficiaries.length > 0, "ModStore::setTicketMods: NO_OP");

        // The params must be of equal lengths.
        require(
            _beneficiaries.length == _percents.length &&
                _beneficiaries.length == _preferConvertedTickets.length,
            "ModStore::setTicketMods: BAD_ARGS"
        );

        delete ticketMods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _ticketModPercentTotal = 0;

        for (uint256 _i = 0; _i < _beneficiaries.length; _i++) {
            // The percent should be less than 200.
            require(
                _percents[_i] > 0 && _percents[_i] <= 200,
                "ModStore::setTicketMods: BAD_PERCENT"
            );

            // Push the new mod into the project's list of mods.
            ticketMods[_projectId].push(
                TicketMod(
                    _beneficiaries[_i],
                    uint16(_percents[_i]),
                    _preferConvertedTickets[_i]
                )
            );
            // Add to the total percents.
            _ticketModPercentTotal = _ticketModPercentTotal + _percents[_i];
        }

        // The total percent should be less than 200.
        require(
            _ticketModPercentTotal <= 200,
            "ModStore::setTicketMods: BAD_PERCENTS"
        );

        emit SetTicketMods(_projectId, ticketMods[_projectId]);
    }
}
