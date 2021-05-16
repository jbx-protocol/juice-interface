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

    mapping(uint256 => IERC20Ticket) public override erc20Tickets;
    mapping(address => mapping(uint256 => uint256)) public override IOU;
    mapping(uint256 => mapping(address => bool)) public override isController;

    IProjects public immutable override projects;
    IOperatorStore public immutable override operatorStore;

    // --- external transactions --- //

    constructor(IProjects _projects, IOperatorStore _operatorStore) {
        projects = _projects;
        operatorStore = _operatorStore;
    }

    function totalSupply(uint256 _projectId)
        external
        view
        override
        returns (uint256 _result)
    {
        _result = IOUTotalSupply[_projectId];
        IERC20Ticket _erc20Ticket = erc20Tickets[_projectId];
        if (_erc20Ticket != IERC20Ticket(0))
            _result = _result.add(_erc20Ticket.totalSupply());
    }

    function totalBalanceOf(address _holder, uint256 _projectId)
        external
        view
        override
        returns (uint256 _result)
    {
        _result = IOU[_holder][_projectId];
        IERC20Ticket _erc20Ticket = erc20Tickets[_projectId];
        if (_erc20Ticket != IERC20Ticket(0))
            _result = _result.add(_erc20Ticket.balanceOf(_holder));
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
        require(
            isController[_projectId][msg.sender],
            "Tickets::print: UNAUTHORIZED"
        );

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
        require(
            isController[_projectId][msg.sender],
            "Tickets::redeem: UNAUTHORIZED"
        );

        // Get a reference to the project's ERC20 tickets.
        IERC20Ticket _erc20Ticket = erc20Tickets[_projectId];

        uint256 _IOU = IOU[_holder][_projectId];

        if (_IOU > _amount) {
            IOU[_holder][_projectId] = IOU[_holder][_projectId].sub(_amount);

            // Reduce the total supply.
            IOUTotalSupply[_projectId] = IOUTotalSupply[_projectId] - _amount;
        } else {
            require(
                _erc20Ticket != IERC20Ticket(0),
                "Tickets::redeem: INSUFICIENT_FUNDS"
            );
            if (_IOU > 0) {
                IOU[_holder][_projectId] = 0;
                // Reduce the total supply.
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

        uint256 _amount = IOU[_holder][_projectId];

        if (_amount == 0) return;

        IOU[_holder][_projectId] = IOU[_holder][_projectId].sub(_amount);
        _erc20Ticket.print(_holder, _amount);

        emit Claim(_holder, _projectId, _amount, msg.sender);
    }

    function addController(address _controller, uint256 _projectId)
        external
        override
    {
        require(
            isController[_projectId][msg.sender] || this.isAdmin(msg.sender),
            "Tickets::addAdmin: UNAUTHORIZED"
        );

        isController[_projectId][_controller] = true;

        emit AddController(_controller, _projectId, msg.sender);
    }

    function removeController(address _controller, uint256 _projectId)
        external
        override
    {
        require(
            isController[_projectId][msg.sender],
            "Tickets::addAdmin: UNAUTHORIZED"
        );
        isController[_projectId][_controller] = false;
        emit RemoveController(_controller, _projectId, msg.sender);
    }
}
