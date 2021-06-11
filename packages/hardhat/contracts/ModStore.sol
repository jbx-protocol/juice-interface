// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IModStore.sol";
import "./libraries/Operations.sol";
import "./abstract/Operatable.sol";

/**
  @notice
  Stores mods for each project.

  @dev
  Mods can be used to distribute a percentage of payments or tickets to preconfigured beneficiaries.
*/
contract ModStore is IModStore, Operatable {
    // --- private stored properties --- //

    // All payment mods for each project ID.
    mapping(uint256 => PaymentMod[]) private _paymentMods;

    // All ticket mods for each project ID.
    mapping(uint256 => TicketMod[]) private _ticketMods;

    // --- public immutable stored properties --- //

    /// @notice The contract storing project information.
    IProjects public immutable override projects;

    /// @notice the permision index required to set payment mods on an owners behalf.
    uint256 public immutable override setPaymentModsPermissionIndex =
        Operations.SetPaymentMods;

    /// @notice the permision index required to set ticket mods on an owners behalf.
    uint256 public immutable override setTicketModsPermissionIndex =
        Operations.SetTicketMods;

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
    constructor(IProjects _projects, IOperatorStore _operatorStore)
        Operatable(_operatorStore)
    {
        projects = _projects;
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
        requirePermission(
            projects.ownerOf(_projectId),
            _projectId,
            setPaymentModsPermissionIndex,
            false
        )
    {
        // There must be something to do.
        require(_mods.length > 0, "ModStore::setPaymentMods: NO_OP");

        // Delete from storage so mods can be repopulated.
        delete _paymentMods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _paymentModPercentTotal = 0;

        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // The percent should be greater than 0.
            require(
                _mods[_i].percent > 0,
                "ModStore::setPaymentMods: BAD_MOD_PERCENT"
            );

            // Add to the total percents.
            _paymentModPercentTotal =
                _paymentModPercentTotal +
                _mods[_i].percent;

            // The total percent should be less than 200.
            require(
                _paymentModPercentTotal <= 200,
                "ModStore::setPaymentMods: BAD_TOTAL_PERCENT"
            );

            // The allocator and the beneficiary shouldn't both be the zero address.
            require(
                _mods[_i].allocator != IModAllocator(address(0)) ||
                    _mods[_i].beneficiary != address(0),
                "ModStore::setPaymentMods: ZERO_ADDRESS"
            );

            // Push the new mod into the project's list of mods.
            _paymentMods[_projectId].push(_mods[_i]);

            emit SetPaymentMod(_projectId, _mods[_i], msg.sender);
        }
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
        requirePermission(
            projects.ownerOf(_projectId),
            _projectId,
            setTicketModsPermissionIndex,
            false
        )
    {
        // There must be something to do.
        require(_mods.length > 0, "ModStore::setTicketMods: NO_OP");

        // Delete from storage so mods can be repopulated.
        delete _ticketMods[_projectId];

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _ticketModPercentTotal = 0;

        for (uint256 _i = 0; _i < _mods.length; _i++) {
            // The percent should be greater than 0.
            require(
                _mods[_i].percent > 0,
                "ModStore::setTicketMods: BAD_MOD_PERCENT"
            );

            // Add to the total percents.
            _ticketModPercentTotal = _ticketModPercentTotal + _mods[_i].percent;
            // The total percent should be less than 200.
            require(
                _ticketModPercentTotal <= 200,
                "ModStore::setTicketMods: BAD_TOTAL_PERCENT"
            );

            // The beneficiary shouldn't be the zero address.
            require(
                _mods[_i].beneficiary != address(0),
                "ModStore::setTicketMods: ZERO_ADDRESS"
            );

            // Push the new mod into the project's list of mods.
            _ticketMods[_projectId].push(_mods[_i]);

            emit SetTicketMod(_projectId, _mods[_i], msg.sender);
        }
    }
}
