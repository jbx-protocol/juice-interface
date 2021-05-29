// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IModStore.sol";
import "./libraries/Operations.sol";

/**
  @notice
  Stores mods for each project.

  @dev
  Mods can be used to distribute a percentage of payments or tickets to preconfigured beneficiaries.
*/
contract ModStore is IModStore {
    // --- private stored properties --- //

    // All payment mods for each project ID.
    mapping(uint256 => PaymentMod[]) private _paymentMods;

    // All ticket mods for each project ID.
    mapping(uint256 => TicketMod[]) private _ticketMods;

    // --- public immutable stored properties --- //

    /// @notice The contract storing project information.
    IProjects public immutable override projects;

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable override operatorStore;

    /// @notice the permision index required to set payment mods on an owners behalf.
    uint256 public immutable override setPaymentModsPermissionIndex =
        Operations.SetPaymentMods;

    // --- public views --- //

    /**
      @notice 
      Get all payment mods for the specified project ID.

      @param _projectId The ID of the project to get mods for.

      @return An array of all mods for the project.
     */
    function paymentMods(uint256 _projectId)
        external
        view
        override
        returns (PaymentMod[] memory)
    {
        return _paymentMods[_projectId];
    }

    /**
      @notice 
      Get all ticket mods for the specified project ID.

      @param _projectId The ID of the project to get mods for.

      @return An array of all mods for the project.
     */
    function ticketMods(uint256 _projectId)
        external
        view
        override
        returns (TicketMod[] memory)
    {
        return _ticketMods[_projectId];
    }

    // --- external transactions --- //

    /** 
      @param _projects The contract storing project information
      @param _operatorStore A contract storing operator assignments.
    */
    constructor(IProjects _projects, IOperatorStore _operatorStore) {
        projects = _projects;
        operatorStore = _operatorStore;
    }

    /** 
      @notice 
      Adds a mod to the payment mods list.

      @param _projectId The project to add a mod to.
      @param _mods The payment mods to set.
    */
    function setPaymentMods(uint256 _projectId, PaymentMod[] memory _mods)
        external
        override
    {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner, or a delegated operator of level 2 or higher, can add a mod.
        require(
            msg.sender == _owner ||
                operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    setPaymentModsPermissionIndex
                ),
            "ModStore::setPaymentMods: UNAUTHORIZED"
        );

        // There must be something to do.
        require(_mods.length > 0, "ModStore::setPaymentMods: NO_OP");

        // Delete from storage so mods can be repopulated.
        delete _paymentMods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _paymentModPercentTotal = 0;

        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // The percent should be less than 200.
            require(
                _mods[_i].percent > 0 && _mods[_i].percent <= 200,
                "ModStore::setPaymentMods: BAD_MOD_PERCENT"
            );

            // The allocator and the beneficiary shouldn't both be the zero address.
            require(
                _mods[_i].allocator != IModAllocator(address(0)) ||
                    _mods[_i].beneficiary != address(0),
                "ModStore::setPaymentMods: ZERO_ADDRESS"
            );

            // Push the new mod into the project's list of mods.
            _paymentMods[_projectId].push(_mods[_i]);

            // Add to the total percents.
            _paymentModPercentTotal =
                _paymentModPercentTotal +
                _mods[_i].percent;
        }

        // The total percent should be less than 200.
        require(
            _paymentModPercentTotal <= 200,
            "ModStore::setPaymentMods: BAD_TOTAL_PERCENT"
        );

        emit SetPaymentMods(_projectId, _mods, msg.sender);
    }

    /** 
      @notice 
      Adds a mod to the ticket mods list.

      @param _projectId The project to add a mod to.
      @param _mods The ticket mods to set.
    */
    function setTicketMods(uint256 _projectId, TicketMod[] memory _mods)
        external
        override
    {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only the project owner or a delegated operator can add a mod.
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
        require(_mods.length > 0, "ModStore::setTicketMods: NO_OP");

        // Delete from storage so mods can be repopulated.
        delete _ticketMods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _ticketModPercentTotal = 0;

        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // The percent should be less than 200.
            require(
                _mods[_i].percent > 0 && _mods[_i].percent <= 200,
                "ModStore::setTicketMods: BAD_PERCENT"
            );

            // The beneficiary shouldn't be the zero address.
            require(
                _mods[_i].beneficiary != address(0),
                "ModStore::setTicketMods: ZERO_ADDRESS"
            );

            // Push the new mod into the project's list of mods.
            _ticketMods[_projectId].push(_mods[_i]);

            // Add to the total percents.
            _ticketModPercentTotal = _ticketModPercentTotal + _mods[_i].percent;
        }

        // The total percent should be less than 200.
        require(
            _ticketModPercentTotal <= 200,
            "ModStore::setTicketMods: BAD_PERCENTS"
        );

        emit SetTicketMods(_projectId, _mods, msg.sender);
    }
}
