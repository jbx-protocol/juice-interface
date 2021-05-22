// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

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
      @notice Adds mods of any kind to the appropriate list.
      @param _projectId The project to add a mod to.
      @param _kinds The kinds of your mods. This can be either TapAmount or ReservedTickets
      @param _beneficiaries The addresses being funded from your tapped amount.
      @param _percents The percents of your target amount to send to the beneficiary of this mod. Out of 1000.
      @param _preferConvertedTickets Whether allocated tickets should attempt to auto claim ERC20s.
    */
    function setMods(
        uint256 _projectId,
        ModKind[] memory _kinds,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents,
        bool[] memory _preferConvertedTickets
    ) external override {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner, or a delegated operator of level 2 or higher, can add a mod.
        require(
            msg.sender == _owner ||
                (operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    Operations.SetPaymentMods
                ) &&
                    operatorStore.hasPermission(
                        _owner,
                        _projectId,
                        msg.sender,
                        Operations.SetTicketMods
                    )),
            "Juicer::setMods: UNAUTHORIZED"
        );

        // There must be something to do.
        require(_beneficiaries.length > 0, "ModStore::setMods: NO_OP");

        // The params must be of equal lengths.
        require(
            _beneficiaries.length == _percents.length &&
                _beneficiaries.length == _kinds.length &&
                _beneficiaries.length == _preferConvertedTickets.length,
            "ModStore::setMods: BAD_ARGS"
        );

        // Delete the storage values in order to repopulate.
        delete paymentMods[_projectId];
        delete ticketMods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _paymentModPercentTotal = 0;
        uint256 _ticketModPercentTotal = 0;

        for (uint256 _i = 0; _i < _beneficiaries.length; _i++) {
            // Either the amount or the percent must be specified.
            require(
                _percents[_i] > 0 && _percents[_i] <= 1000,
                "ModStore::setMods: BAD_PERCENT"
            );

            if (_kinds[_i] == ModKind.Payment || _kinds[_i] == ModKind.Both) {
                // Push the new mod into the project's list of mods.
                paymentMods[_projectId].push(
                    PaymentMod(_beneficiaries[_i], uint16(_percents[_i]))
                );
                // Add to the total percents.
                _paymentModPercentTotal =
                    _paymentModPercentTotal +
                    _percents[_i];
            }
            if (_kinds[_i] == ModKind.Ticket || _kinds[_i] == ModKind.Both) {
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
        }

        // The total percent should be less than 1000.
        require(
            _paymentModPercentTotal <= 1000 && _ticketModPercentTotal <= 1000,
            "ModStore::setMods: BAD_PERCENTS"
        );

        if (paymentMods[_projectId].length > 0)
            emit SetPaymentMods(_projectId, paymentMods[_projectId]);

        if (ticketMods[_projectId].length > 0)
            emit SetTicketMods(_projectId, ticketMods[_projectId]);
    }

    /** 
      @notice Adds a mod to the payment mods list.
      @param _projectId The project to add a mod to.
      @param _beneficiaries The addresses to send payments to.
      @param _percents The percents of total funds to send to each mod.
    */
    function setPaymentMods(
        uint256 _projectId,
        address payable[] memory _beneficiaries,
        uint256[] memory _percents
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
            _beneficiaries.length == _percents.length,
            "ModStore::setPaymentMods: BAD_ARGS"
        );

        // Delete from storage.
        delete paymentMods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _paymentModPercentTotal = 0;

        for (uint256 _i = 0; _i < _beneficiaries.length; _i++) {
            // The percent should be less than 1000.
            require(
                _percents[_i] > 0 && _percents[_i] <= 1000,
                "ModStore::setPaymentMods: BAD_PERCENT"
            );

            // Push the new mod into the project's list of mods.
            paymentMods[_projectId].push(
                PaymentMod(_beneficiaries[_i], uint16(_percents[_i]))
            );
            // Add to the total percents.
            _paymentModPercentTotal = _paymentModPercentTotal + _percents[_i];
        }

        // The total percent should be less than 1000.
        require(
            _paymentModPercentTotal <= 1000,
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
            // The percent should be less than 1000.
            require(
                _percents[_i] > 0 && _percents[_i] <= 1000,
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

        // The total percent should be less than 1000.
        require(
            _ticketModPercentTotal <= 1000,
            "ModStore::setTicketMods: BAD_PERCENTS"
        );

        emit SetTicketMods(_projectId, ticketMods[_projectId]);
    }
}
