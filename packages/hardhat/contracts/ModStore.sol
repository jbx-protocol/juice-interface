// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IModStore.sol";
import "./abstract/Operatable.sol";
import "./abstract/TerminalUtility.sol";

import "./libraries/Operations.sol";

/**
  @notice
  Stores mods for each project.

  @dev
  Mods can be used to distribute a percentage of payments or tickets to preconfigured beneficiaries.
*/
contract ModStore is IModStore, Operatable, TerminalUtility {
    // --- private stored properties --- //

    // All payment mods for each project ID's configurations.
    mapping(uint256 => mapping(uint256 => PaymentMod[])) private _paymentModsOf;

    // All ticket mods for each project ID's configurations.
    mapping(uint256 => mapping(uint256 => TicketMod[])) private _ticketModsOf;

    // --- public immutable stored properties --- //

    /// @notice The contract storing project information.
    IProjects public immutable override projects;

    // --- public views --- //

    /**
      @notice 
      Get all payment mods for the specified project ID.

      @param _projectId The ID of the project to get mods for.
      @param _configuration The configuration to get mods for.

      @return An array of all mods for the project.
     */
    function paymentModsOf(uint256 _projectId, uint256 _configuration)
        external
        view
        override
        returns (PaymentMod[] memory)
    {
        return _paymentModsOf[_projectId][_configuration];
    }

    /**
      @notice 
      Get all ticket mods for the specified project ID.

      @param _projectId The ID of the project to get mods for.
      @param _configuration The configuration to get mods for.

      @return An array of all mods for the project.
     */
    function ticketModsOf(uint256 _projectId, uint256 _configuration)
        external
        view
        override
        returns (TicketMod[] memory)
    {
        return _ticketModsOf[_projectId][_configuration];
    }

    // --- external transactions --- //

    /** 
      @param _projects The contract storing project information
      @param _operatorStore A contract storing operator assignments.
      @param _terminalDirectory A directory of a project's current Juice terminal to receive payments in.
    */
    constructor(
        IProjects _projects,
        IOperatorStore _operatorStore,
        ITerminalDirectory _terminalDirectory
    ) Operatable(_operatorStore) TerminalUtility(_terminalDirectory) {
        projects = _projects;
    }

    /** 
      @notice 
      Adds a mod to the payment mods list.

      @param _projectId The project to add a mod to.
      @param _configuration The configuration to set the mods to be active during.
      @param _mods The payment mods to set.
    */
    function setPaymentMods(
        uint256 _projectId,
        uint256 _configuration,
        PaymentMod[] memory _mods
    )
        external
        override
        requirePermissionAcceptingAlternateAddress(
            projects.ownerOf(_projectId),
            _projectId,
            Operations.SetPaymentMods,
            // The project's terminal can also make this call.
            address(terminalDirectory.terminalOf(_projectId))
        )
    {
        // There must be something to do.
        require(_mods.length > 0, "ModStore::setPaymentMods: NO_OP");

        // Get a reference to the project's payment mods.
        PaymentMod[] memory _currentMods =
            _paymentModsOf[_projectId][_configuration];

        // Check to see if all locked Mods are included.
        for (uint256 _i = 0; _i < _currentMods.length; _i++) {
            if (block.timestamp < _currentMods[_i].lockedUntil) {
                bool _includesLocked = false;
                for (uint256 _j = 0; _j < _mods.length; _j++) {
                    // Check for sameness. Let the note change.
                    if (
                        _mods[_j].percent == _currentMods[_i].percent &&
                        _mods[_j].beneficiary == _currentMods[_i].beneficiary &&
                        _mods[_j].allocator == _currentMods[_i].allocator &&
                        _mods[_j].projectId == _currentMods[_i].projectId &&
                        // Allow lock expention.
                        _mods[_j].lockedUntil >= _currentMods[_i].lockedUntil
                    ) _includesLocked = true;
                }
                require(
                    _includesLocked,
                    "ModStore::setPaymentMods: SOME_LOCKED"
                );
            }
        }

        // Delete from storage so mods can be repopulated.
        delete _paymentModsOf[_projectId][_configuration];

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
            _paymentModsOf[_projectId][_configuration].push(_mods[_i]);

            emit SetPaymentMod(
                _projectId,
                _configuration,
                _mods[_i],
                msg.sender
            );
        }
    }

    /** 
      @notice 
      Adds a mod to the ticket mods list.

      @param _projectId The project to add a mod to.
      @param _configuration The configuration to set the mods to be active during.
      @param _mods The ticket mods to set.
    */
    function setTicketMods(
        uint256 _projectId,
        uint256 _configuration,
        TicketMod[] memory _mods
    )
        external
        override
        requirePermissionAcceptingAlternateAddress(
            projects.ownerOf(_projectId),
            _projectId,
            Operations.SetTicketMods,
            // The project's terminal can also make this call.
            address(terminalDirectory.terminalOf(_projectId))
        )
    {
        // There must be something to do.
        require(_mods.length > 0, "ModStore::setTicketMods: NO_OP");

        // Get a reference to the project's ticket mods.
        TicketMod[] memory _projectTicketMods =
            _ticketModsOf[_projectId][_configuration];

        // Check to see if all locked Mods are included.
        for (uint256 _i = 0; _i < _projectTicketMods.length; _i++) {
            if (block.timestamp < _projectTicketMods[_i].lockedUntil) {
                bool _includesLocked = false;
                for (uint256 _j = 0; _j < _mods.length; _j++) {
                    // Check for the same values.
                    if (
                        _mods[_j].percent == _projectTicketMods[_i].percent &&
                        _mods[_j].beneficiary ==
                        _projectTicketMods[_i].beneficiary &&
                        // Allow lock extensions.
                        _mods[_j].lockedUntil >=
                        _projectTicketMods[_i].lockedUntil
                    ) _includesLocked = true;
                }
                require(
                    _includesLocked,
                    "ModStore::setTicketMods: SOME_LOCKED"
                );
            }
        }
        // Delete from storage so mods can be repopulated.
        delete _ticketModsOf[_projectId][_configuration];

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
            _ticketModsOf[_projectId][_configuration].push(_mods[_i]);

            emit SetTicketMod(
                _projectId,
                _configuration,
                _mods[_i],
                msg.sender
            );
        }
    }
}
