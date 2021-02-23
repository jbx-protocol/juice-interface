// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./abstract/Store.sol";
import "./interfaces/ITicketStore.sol";
import "./Tickets.sol";

/** 
  @notice An immutable contract to save Ticket states.
*/
contract TicketStore is Store, ITicketStore {
    using SafeMath for uint256;

    // --- public properties --- //

    /// @notice The Tickets handed out by each issuer. Each issuer has their own Tickets contract.
    mapping(address => Tickets) public override tickets;

    /// @notice The current cumulative amount of tokens redeemable by each issuer's Tickets.
    mapping(address => uint256) public override claimable;

    /// @notice The current cumulative amount of tokens redeemable in the system.
    uint256 public override totalClaimable = 0;

    /// @notice The amount of Tickets owed to each address from each token issuer.
    mapping(address => mapping(address => uint256)) public override iOweYous;

    /// @notice The total amount of Tickets owed for each token issuer.
    mapping(address => uint256) public override totalIOweYous;

    /// @notice The

    // --- external views --- //

    /**
        @notice The amount of tokens that a Ticket can be redeemed for.
        @param _issuer The issuer of the Ticket to get a value for.
        @return _value The value.
    */
    function getTicketValue(address _issuer)
        external
        view
        override
        returns (uint256)
    {
        Tickets _tickets = tickets[_issuer];
        return claimable[_issuer].div(_tickets.totalSupply());
    }

    // --- public views --- //

    /**
        @notice The amount of tokens that can be claimed by the given address.
        @param _holder The address to get an amount for.
        @param _amount The amount of Tickets being redeemed.
        Must be within the holder's balance.
        @param _issuer The issuer of the Tickets to get an amount for.
        @param _proportion The proportion of the hodler's tickets to make claimable. Out of 1000.
        This creates an opportunity for incenvizing HODLing.
        If the specified `_holder` is the last holder, the proportion will fall back to 1000.
        @return amount The amount of tokens that can be claimed.
    */
    function getClaimableAmount(
        address _holder,
        uint256 _amount,
        address _issuer,
        uint256 _proportion
    ) public view override returns (uint256) {
        // If there isnt any iOweYou for the specified holder, get issued tickets for the issuer.
        Tickets _tickets =
            iOweYous[_issuer][_holder] == 0 ? tickets[_issuer] : Tickets(0);

        // Get the total supply either from the ticket or from the iOweYou.
        uint256 _totalSupply =
            _tickets != Tickets(0)
                ? _tickets.totalSupply()
                : totalIOweYous[_issuer];

        if (_totalSupply == 0) return 0;

        // Get the amount of tickets the specified holder has access to, or is owed.
        uint256 _currentBalance =
            _tickets != Tickets(0)
                ? _tickets.balanceOf(_holder)
                : iOweYous[_issuer][_holder];

        // Make sure the specified amount is available.
        require(
            _currentBalance > _amount,
            "TicketStore::getClaimableRewardsAmount: INSUFFICIENT_FUNDS"
        );

        return
            claimable[_issuer]
                .mul(_amount)
                .div(_totalSupply)
                .mul(_amount < _totalSupply ? _proportion : 1000)
                .div(1000);
    }

    // --- external transactions --- //

    constructor() public {}

    /**
        @notice Issues an owner's Tickets that'll be handed out by their budgets in exchange for payments.
        @dev Deploys an owner's Ticket ERC-20 token contract.
        @param _name The ERC-20's name. " Juice ticket" will be appended.
        @param _symbol The ERC-20's symbol. "j" will be prepended.
    */
    function issue(bytes memory _name, bytes memory _symbol) external override {
        // An owner only needs to issue their Tickets once before they can be used.
        require(
            tickets[msg.sender] == Tickets(0),
            "TicketStore::issue: ALREADY_ISSUED"
        );

        // Create the contract in this Juicer contract in order to have mint and burn privileges.
        // Prepend the strings with standards.
        Tickets _tickets =
            new Tickets(
                string(abi.encodePacked(_name, bytes(" Juice ticket"))),
                string(abi.encodePacked(bytes("j"), _symbol))
            );

        tickets[msg.sender] = _tickets;

        emit Issue(msg.sender, _tickets.name(), _tickets.symbol());
    }

    /**
      @notice Convert I-owe-you's to tickets
      @param _issuer The issuer of the tickets.
     */
    function convertIOweYou(address _issuer) external override {
        Tickets _tickets = tickets[_issuer];
        require(
            _tickets != Tickets(0),
            "TicketStore::convertIOweYou: NOT_CLAIMABLE"
        );

        // The amount of I-owe-yous.
        uint256 _amount = iOweYous[_issuer][msg.sender];

        if (_amount == 0) return;

        // Remove any I-owe-yous
        iOweYous[_issuer][msg.sender] = 0;
        totalIOweYous[_issuer] = totalIOweYous[_issuer].sub(_amount);

        // Mint the tickets owed.
        _tickets.mint(msg.sender, _amount);
    }

    /** 
      @notice Mints new tickets.
      @param _issuer The issuer of the tickets being minted.
      @param _holder The address receiving the minted tickets.
      @param _amount The amount of tickets being minted.
    */
    function mint(
        address _issuer,
        address _holder,
        uint256 _amount
    ) external override onlyAdmin {
        Tickets _tickets = tickets[_issuer];
        uint256 _iOweYou = iOweYous[_issuer][_holder];
        // Mint tickets if there are no I-owe-yous and if tickets have been issued.
        if (_iOweYou == 0 && _tickets != Tickets(0)) {
            _tickets.mint(_holder, _amount);
        }
        // Otherwise add to I-owe-you.
        else {
            iOweYous[_issuer][_holder] = _iOweYou.add(_amount);
            totalIOweYous[_issuer] = totalIOweYous[_issuer].add(_amount);
        }
    }

    /** 
      @notice Redeems tickets.
      @param _issuer The issuer of the tickets being redeemed.
      @param _holder The address redeeming tickets.
      @param _amount The amount of tickets being redeemed.
      @param _minClaimed The minimun amount of claimed tokens to receive in return.
      @param _proportion The proportion of claimable tokens to redeem for the specified amount of tickets.
    */
    function redeem(
        address _issuer,
        address _holder,
        uint256 _amount,
        uint256 _minClaimed,
        uint256 _proportion
    ) external override onlyAdmin returns (uint256 returnAmount) {
        // The amount of overflowed tokens claimable by the message sender from the specified issuer by redeeming the specified amount.
        returnAmount = getClaimableAmount(
            _holder,
            _amount,
            _issuer,
            _proportion
        );

        // The amount being claimed must be less than the amount claimable.
        require(
            returnAmount >= _minClaimed,
            "TicketStore::redeem: INSUFFICIENT_FUNDS"
        );

        Tickets _tickets = tickets[_issuer];
        uint256 _iOweYou = iOweYous[_issuer][_holder];

        if (_iOweYou == 0 && _tickets != Tickets(0)) {
            tickets[_issuer].burn(_holder, _amount);
        } else {
            iOweYous[_issuer][_holder] = _iOweYou.sub(_amount);
            totalIOweYous[_issuer] = totalIOweYous[_issuer].sub(_amount);
        }

        // Subtract the claimed tokens from the total amount claimable.
        claimable[_issuer] = claimable[_issuer].sub(returnAmount);
        totalClaimable = totalClaimable.sub(returnAmount);
    }

    /**
        @notice Adds an amount to the total that can be claimed by redeeming the given issuer's Tickets.
        @param _issuer The issuer of the Ticket.
        @param _amount The amount to increment.
    */
    function addClaimable(address _issuer, uint256 _amount)
        external
        override
        onlyAdmin
    {
        claimable[_issuer] = claimable[_issuer].add(_amount);
        totalClaimable = totalClaimable.add(_amount);
    }

    /**
        @notice Clears the amount of claimable tokens the specified issuer has.
        @param _issuer The issuer of the Ticket.
        @return amount The amount cleared.
    */
    function clearClaimable(address _issuer)
        external
        override
        onlyAdmin
        returns (uint256 amount)
    {
        amount = claimable[_issuer];
        claimable[_issuer] = 0;
        totalClaimable = totalClaimable.sub(amount);
    }
}
