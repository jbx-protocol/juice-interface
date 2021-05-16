// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/CompareMath.sol";

import "./interfaces/ITickets.sol";

import "./abstract/Administered.sol";

import "./ERC20Ticket.sol";

/** 
  @notice An immutable contract to manage Ticket states.
*/
contract Tickets is Administered, ITickets {
    using SafeMath for uint256;

    // The total supply of 1155 tickets for each project.
    mapping(uint256 => uint256) private IOUTotalSupply;

    // --- public properties --- //

    // Each project's ERC20 Ticket tokens.
    mapping(uint256 => IERC20Ticket) public override erc20Tickets;

    // Each holder's balance of IOU Tickets for each project.
    mapping(address => mapping(uint256 => uint256)) public override IOU;

    // Each project's controller addresses.
    mapping(uint256 => mapping(address => bool)) public override isController;

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable override operatorStore;

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
        IERC20Ticket _erc20Ticket = erc20Tickets[_projectId];
        if (_erc20Ticket != IERC20Ticket(0))
            supply = supply.add(_erc20Ticket.totalSupply());
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
        balance = IOU[_holder][_projectId];
        IERC20Ticket _erc20Ticket = erc20Tickets[_projectId];
        if (_erc20Ticket != IERC20Ticket(0))
            balance = balance.add(_erc20Ticket.balanceOf(_holder));
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
        string memory _name,
        string memory _symbol
    ) external override {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a project owner or a specified operator can tap its funds.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                4,
            "ERC20TicketStore::issue: UNAUTHORIZED"
        );

        // Only one ERC20 ticket can be issued.
        require(
            erc20Tickets[_projectId] == IERC20Ticket(0),
            "ERC20TicketStore::issue: ALREADY_ISSUED"
        );

        // Create the contract in this Juicer contract in order to have mint and burn privileges.
        // Prepend the strings with standards.
        erc20Tickets[_projectId] = new ERC20Ticket(_name, _symbol);

        emit Issue(_projectId, _name, _symbol, msg.sender);
    }

    /** 
      @notice Print new tickets.
      @param _holder The address receiving the new tickets.
      @param _projectId The project to which the tickets belong.
      @param _amount The amount to print.
    */
    function print(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external override {
        // The printer must be a controller.
        require(
            isController[_projectId][msg.sender],
            "Tickets::print: UNAUTHORIZED"
        );

        // Add to the IOU balance and total supply.
        IOU[_holder][_projectId] = IOU[_holder][_projectId].add(_amount);
        IOUTotalSupply[_projectId] = IOUTotalSupply[_projectId].add(_amount);

        emit Print(_projectId, _holder, _amount, msg.sender);
    }

    /** 
      @notice Redeems tickets.
      @param _holder The address redeeming tickets.
      @param _projectId The ID of the project of the tickets being redeemed.
      @param _amount The amount of tickets being redeemed.
    */
    function redeem(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external override {
        // The redeemer must be a controller.
        require(
            isController[_projectId][msg.sender],
            "Tickets::redeem: UNAUTHORIZED"
        );

        // Get a reference to the project's ERC20 tickets.
        IERC20Ticket _erc20Ticket = erc20Tickets[_projectId];

        // Get a reference to the IOU amount.
        uint256 _IOU = IOU[_holder][_projectId];

        // Redeem only IOUs if there are enough available.
        if (_IOU > _amount) {
            // Reduce the holders balance and the total supply.
            IOU[_holder][_projectId] = IOU[_holder][_projectId].sub(_amount);
            IOUTotalSupply[_projectId] = IOUTotalSupply[_projectId] - _amount;
        } else {
            // If there aren't enough IOUs, redeem all remaining IOUs, and use ERC20s for the difference.
            require(
                _erc20Ticket != IERC20Ticket(0),
                "Tickets::redeem: INSUFICIENT_FUNDS"
            );
            if (_IOU > 0) {
                // Reduce the holders balance and the total supply.
                IOU[_holder][_projectId] = 0;
                IOUTotalSupply[_projectId] = IOUTotalSupply[_projectId] - _IOU;
                _erc20Ticket.redeem(_holder, _amount - _IOU);
            } else {
                _erc20Ticket.redeem(_holder, _amount);
            }
        }

        emit Redeem(_projectId, _holder, _amount, _IOU, msg.sender);
    }

    /**
      @notice Claims ERC20 tickets from IOUs.
      @param _holder The owner of the tickets to convert.
      @param _projectId The ID of the project whos tickets are being claimed.
     */
    function claim(address _holder, uint256 _projectId) external override {
        // Get a reference to the project's ERC20 tickets.
        IERC20Ticket _erc20Ticket = erc20Tickets[_projectId];

        require(_erc20Ticket != IERC20Ticket(0), "Tickets:claim: NOT_FOUND");

        // Only an account or a specified operator can convert its tickets.
        require(
            msg.sender == _holder ||
                operatorStore.operatorLevel(_holder, 0, msg.sender) >= 1 ||
                operatorStore.operatorLevel(_holder, _projectId, msg.sender) >=
                1,
            "Juicer::claim: UNAUTHORIZED"
        );

        // Get a reference to the amount of IOUs.
        uint256 _amount = IOU[_holder][_projectId];

        // If there are no IOUs, there's nothing to claim.
        if (_amount == 0) return;

        // Set the IOUs to zero.
        IOU[_holder][_projectId] = 0;

        // Print the equivalent amount of ERC20s.
        _erc20Ticket.print(_holder, _amount);

        emit Claim(_holder, _projectId, _amount, msg.sender);
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
            isController[_projectId][msg.sender] || this.isAdmin(msg.sender),
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
}
