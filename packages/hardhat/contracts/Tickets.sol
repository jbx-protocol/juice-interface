// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./libraries/Operations.sol";
import "./interfaces/ITickets.sol";
import "./abstract/Administered.sol";
import "./Ticket.sol";

/** 
  @notice 
  Manage Ticket printing, redemption, and account balances.

  @dev
  Tickets can be either represented internally, or as ERC-20s.
  This contract manages these two representations and the conversion between the two.
*/
contract Tickets is Administered, ITickets {
    // --- public properties --- //

    // Each project's ERC20 Ticket tokens.
    mapping(uint256 => ITicket) public override tickets;

    // Each holder's balance of IOU Tickets for each project.
    mapping(address => mapping(uint256 => uint256)) public override IOUBalance;

    // The total supply of 1155 tickets for each project.
    mapping(uint256 => uint256) public override IOUTotalSupply;

    // The amount of each holders tickets that are locked.
    mapping(address => mapping(uint256 => uint256)) public override locked;

    // Each project's controller addresses.
    mapping(uint256 => mapping(address => bool)) public override isController;

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable override operatorStore;

    /// @notice the permision index required to issue tickets on an owners behalf.
    uint256 public immutable override issuePermissionIndex = Operations.Issue;

    // --- external transactions --- //

    /** 
      @param _projects A Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _operatorStore A contract storing operator assignments.
    */
    constructor(IProjects _projects, IOperatorStore _operatorStore) {
        projects = _projects;
        operatorStore = _operatorStore;
    }

    /** 
      @notice The total supply of tickets for each project, including IOU and ERC20 tickets.
      @return supply The total supply.
    */
    function totalSupply(uint256 _projectId)
        external
        view
        override
        returns (uint256 supply)
    {
        // Get the IOU supply.
        supply = IOUTotalSupply[_projectId];

        // Add the ERC20 supply if it's been issued.
        ITicket _ticket = tickets[_projectId];
        if (_ticket != ITicket(address(0)))
            supply = supply + _ticket.totalSupply();
    }

    /** 
      @notice The total balance of tickets a holder has for a specified project, including IOU and ERC20 tickets.
      @param _holder The ticket holder to get a balance for.
      @param _projectId The project to get the `_hodler`s balance of.
      @return balance The balance.
    */
    function totalBalanceOf(address _holder, uint256 _projectId)
        external
        view
        override
        returns (uint256 balance)
    {
        balance = IOUBalance[_holder][_projectId];
        ITicket _ticket = tickets[_projectId];
        if (_ticket != ITicket(address(0)))
            balance = balance + _ticket.balanceOf(_holder);
    }

    /**
        @notice Issues an owner's Tickets that'll be handed out by their budgets in exchange for payments.
        @dev Deploys an owner's Ticket ERC-20 token contract.
        @param _projectId The ID of the project being issued tickets.
        @param _name The ERC-20's name. " Juice ticket" will be appended.
        @param _symbol The ERC-20's symbol. "j" will be prepended.
    */
    function issue(
        uint256 _projectId,
        string calldata _name,
        string calldata _symbol
    ) external override {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a project owner or a specified operator can tap its funds.
        require(
            msg.sender == _owner ||
                operatorStore.hasPermission(
                    _owner,
                    _projectId,
                    msg.sender,
                    issuePermissionIndex
                ),
            "Tickets::issue: UNAUTHORIZED"
        );

        // Only one ERC20 ticket can be issued.
        require(
            tickets[_projectId] == ITicket(address(0)),
            "Tickets::issue: ALREADY_ISSUED"
        );

        // Create the contract in this Juicer contract in order to have mint and burn privileges.
        // Prepend the strings with standards.
        tickets[_projectId] = new Ticket(_name, _symbol);

        emit Issue(_projectId, _name, _symbol, msg.sender);
    }

    /** 
      @notice Print new tickets.
      @param _holder The address receiving the new tickets.
      @param _projectId The project to which the tickets belong.
      @param _amount The amount to print.
      @param _preferConvertedTickets Whether ERC20's should be converted automatically if they have been issued.
    */
    function print(
        address _holder,
        uint256 _projectId,
        uint256 _amount,
        bool _preferConvertedTickets
    ) external override {
        // The printer must be a controller.
        require(
            isController[_projectId][msg.sender],
            "Tickets::print: UNAUTHORIZED"
        );

        // An amount must be specified.
        require(_amount > 0, "Tickets::print: NO_OP");

        // Get a reference to the project's ERC20 tickets.
        ITicket _ticket = tickets[_projectId];

        // If there exists ERC-20 tickets and the caller prefers these converted tickets.
        bool _shouldConvertTickets =
            _preferConvertedTickets && _ticket != ITicket(address(0));

        if (_shouldConvertTickets) {
            // Print the equivalent amount of ERC20s.
            _ticket.print(_holder, _amount);
        } else {
            // Add to the IOU balance and total supply.
            IOUBalance[_holder][_projectId] =
                IOUBalance[_holder][_projectId] +
                _amount;
            IOUTotalSupply[_projectId] = IOUTotalSupply[_projectId] + _amount;
        }

        emit Print(
            _projectId,
            _holder,
            _amount,
            _shouldConvertTickets,
            _preferConvertedTickets,
            msg.sender
        );
    }

    /** 
      @notice Redeems tickets.
      @param _holder The address redeeming tickets.
      @param _projectId The ID of the project of the tickets being redeemed.
      @param _amount The amount of tickets being redeemed.
      @param _preferConverted If the preference is to redeem tickets that have been converted to ERC-20s.
    */
    function redeem(
        address _holder,
        uint256 _projectId,
        uint256 _amount,
        bool _preferConverted
    ) external override {
        // The redeemer must be a controller.
        require(
            isController[_projectId][msg.sender],
            "Tickets::redeem: UNAUTHORIZED"
        );

        // Get a reference to the project's ERC20 tickets.
        ITicket _ticket = tickets[_projectId];

        // Get a reference to the IOU amount.
        uint256 _unlockedIOUBalance =
            IOUBalance[_holder][_projectId] - locked[_holder][_projectId];

        // Get a reference to the number of tickets there are.
        uint256 _balanceOf =
            _ticket == ITicket(address(0)) ? 0 : _ticket.balanceOf(_holder);

        // There must be enough tickets.
        // Prevent potential overflow by not relying on addition.
        require(
            (_amount < _balanceOf && _amount < _unlockedIOUBalance) ||
                (_amount >= _balanceOf &&
                    _unlockedIOUBalance >= _amount - _balanceOf) ||
                (_amount >= _unlockedIOUBalance &&
                    _balanceOf >= _amount - _unlockedIOUBalance),
            "Tickets::redeem: INSUFICIENT_FUNDS"
        );

        // The amount of tickets to redeem.
        uint256 _ticketsToRedeem;

        // If there's no balance, redeem no tickets
        if (_balanceOf == 0) {
            _ticketsToRedeem = 0;
            // If prefer converted, redeem tickets before redeeming IOUs.
        } else if (_preferConverted) {
            _ticketsToRedeem = _balanceOf >= _amount ? _amount : _balanceOf;
            // Otherwise, redeem IOUs before redeeming tickets.
        } else {
            _ticketsToRedeem = _unlockedIOUBalance >= _amount
                ? 0
                : _amount - _unlockedIOUBalance;
        }

        // The amount of IOUs to redeem.
        uint256 _IOUsToRedeem = _amount - _ticketsToRedeem;

        // Redeem the tickets and IOUs.
        if (_ticketsToRedeem > 0) _ticket.redeem(_holder, _ticketsToRedeem);
        if (_IOUsToRedeem > 0) {
            // Reduce the holders balance and the total supply.
            IOUBalance[_holder][_projectId] =
                IOUBalance[_holder][_projectId] -
                _IOUsToRedeem;
            IOUTotalSupply[_projectId] =
                IOUTotalSupply[_projectId] -
                _IOUsToRedeem;
        }

        emit Redeem(
            _projectId,
            _holder,
            _amount,
            _unlockedIOUBalance,
            _preferConverted,
            msg.sender
        );
    }

    /**
      @notice Converts to  ERC20 tickets from IOUs.
      @param _holder The owner of the tickets to convert.
      @param _projectId The ID of the project whos tickets are being converted.
     */
    function convert(address _holder, uint256 _projectId) external override {
        // Get a reference to the project's ERC20 tickets.
        ITicket _ticket = tickets[_projectId];

        require(_ticket != ITicket(address(0)), "Tickets:convert: NOT_FOUND");

        // Only an account or a specified operator can convert its tickets.
        require(
            msg.sender == _holder ||
                operatorStore.hasPermission(
                    _holder,
                    0,
                    msg.sender,
                    Operations.Convert
                ) ||
                operatorStore.hasPermission(
                    _holder,
                    _projectId,
                    msg.sender,
                    Operations.Convert
                ),
            "Juicer::convert: UNAUTHORIZED"
        );

        // Get a reference to the amount of unlockedIOUs.
        uint256 _unlockedIOUs =
            IOUBalance[_holder][_projectId] - locked[_holder][_projectId];

        // If there are no IOUs, there's nothing to convert.
        if (_unlockedIOUs == 0) return;

        // Set the IOUs to the locked amount.
        IOUBalance[_holder][_projectId] = locked[_holder][_projectId];

        // Print the equivalent amount of ERC20s.
        _ticket.print(_holder, _unlockedIOUs);

        emit Convert(_holder, _projectId, _unlockedIOUs, msg.sender);
    }

    /** 
      @notice Initialied tickets by setting the first controller that can print and redeem tickets on a project's behalf.
      @param _controller The controller to add.
      @param _projectId The ID of the project that will be controlled.
    */
    function initialize(address _controller, uint256 _projectId)
        external
        override
        onlyAdmin
    {
        // The the controller status.
        isController[_projectId][_controller] = true;

        emit Initialize(_controller, _projectId, msg.sender);
    }

    /** 
      @notice Adds a controller that can print and redeem tickets on a project's behalf.
      @param _controller The controller to add.
      @param _projectId The ID of the project that will be controlled.
    */
    function addController(address _controller, uint256 _projectId)
        external
        override
    {
        // The message sender must already be a controller of the project, or it must be the admin.
        require(
            isController[_projectId][msg.sender],
            "Tickets::addAdmin: UNAUTHORIZED"
        );

        // The the controller status.
        isController[_projectId][_controller] = true;

        emit AddController(_controller, _projectId, msg.sender);
    }

    /** 
      @notice Removes a controller.
      @param _controller The controller to remove.
      @param _projectId The ID of the project that will no longer be controlled.
    */
    function removeController(address _controller, uint256 _projectId)
        external
        override
    {
        // The message sender must already be a controller of the project, or it must be the admin.
        require(
            isController[_projectId][msg.sender],
            "Tickets::addAdmin: UNAUTHORIZED"
        );

        // The the controller status.
        isController[_projectId][_controller] = false;

        emit RemoveController(_controller, _projectId, msg.sender);
    }

    /** 
      @notice Lock a project's tickets, preventing them from being redeemed and from converting to ERC20s.
      @param _holder The holder to lock tickets from.
      @param _projectId The ID of the project whos tickets are being locked.
      @param _amount The amount of tickets to lock.
    */
    function lock(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external override onlyAdmin {
        // The holder must have enough tickets to lock.
        require(
            IOUBalance[_holder][_projectId] - locked[_holder][_projectId] >=
                _amount,
            "Tickets::lock: INSUFFICIENT_TICKETS"
        );

        // Update the lock.
        locked[_holder][_projectId] = locked[_holder][_projectId] + _amount;

        emit Lock(_holder, _projectId, _amount, msg.sender);
    }

    /** 
      @notice Unlock a project's tickets.
      @param _holder The holder to unlock tickets from.
      @param _projectId The ID of the project whos tickets are being unlocked.
      @param _amount The amount of tickets to unlock.
    */
    function unlock(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external override onlyAdmin {
        // There must be enough locked tickets to unlock.
        require(
            locked[_holder][_projectId] >= _amount,
            "Tickets::lock: INSUFFICIENT_TICKETS"
        );

        // Update the lock.
        locked[_holder][_projectId] = locked[_holder][_projectId] - _amount;

        emit Unlock(_holder, _projectId, _amount, msg.sender);
    }

    /** 
      @notice Allows a ticket holder to transfer its tickets to another account, without converting to ERC-20s.
      @param _holder The holder to transfer tickets from.
      @param _projectId The ID of the project whos tickets are being transfered.
      @param _amount The amount of tickets to transfer.
      @param _recipient The recipient of the tickets.
    */
    function transfer(
        address _holder,
        uint256 _projectId,
        uint256 _amount,
        address _recipient
    ) external override {
        // Only an account or a specified operator can transfer its tickets.
        require(
            msg.sender == _holder ||
                operatorStore.hasPermission(
                    _holder,
                    0,
                    msg.sender,
                    Operations.Transfer
                ) ||
                operatorStore.hasPermission(
                    _holder,
                    _projectId,
                    msg.sender,
                    Operations.Transfer
                ),
            "Juicer::transfer: UNAUTHORIZED"
        );

        // Get a reference to the amount of unlockedIOUs.
        uint256 _unlockedIOUs =
            IOUBalance[_holder][_projectId] - locked[_holder][_projectId];

        // There must be enough unlocked IOUs to transfer.
        require(
            _amount <= _unlockedIOUs,
            "Tickets::transfer: INSUFFICIENT_FUNDS"
        );

        // Subtract from the holder.
        IOUBalance[_holder][_projectId] = _unlockedIOUs - _amount;

        // Add the tickets to the recipient.
        IOUBalance[_recipient][_projectId] =
            IOUBalance[_recipient][_projectId] +
            _amount;

        emit Transfer(_holder, _projectId, _recipient, _amount, msg.sender);
    }
}
