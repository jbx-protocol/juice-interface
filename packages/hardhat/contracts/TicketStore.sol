// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/DSMath.sol";
import "./libraries/Math.sol";

import "./abstract/Administered.sol";
import "./interfaces/ITicketStore.sol";
import "./Tickets.sol";

/** 
  @notice An immutable contract to manage Ticket states.
*/
contract TicketStore is Administered, ITicketStore {
    using SafeMath for uint256;

    // --- public properties --- //

    /// @notice The Tickets handed out by each issuer. Each issuer has their own Tickets contract.
    mapping(uint256 => Tickets) public override tickets;

    /// @notice The current cumulative amount of tokens redeemable by each project's Tickets.
    mapping(uint256 => uint256) public override claimable;

    /// @notice The current cumulative amount of tokens redeemable in the system.
    uint256 public override totalClaimable = 0;

    // --- external views --- //

    /**
        @notice The amount of tokens that a Ticket can be redeemed for.
        @param _project The project of the Ticket to get a value for.
        @return _value The value.
    */
    function getTicketValue(uint256 _project)
        external
        view
        override
        returns (uint256)
    {
        return claimable[_project].div(tickets[_project].totalSupply());
    }

    // --- public views --- //

    /**
        @notice The amount of tokens that can be claimed by the given address.
        @param _holder The address to get an amount for.
        @param _amount The amount of Tickets being redeemed.
        Must be within the holder's balance.
        @param _project The project of the Tickets to get an amount for.
        @param _proportion The proportion of the hodler's tickets to make claimable. Out of 1000.
        This creates an opportunity for incenvizing HODLing.
        If the specified `_holder` is the last holder, the proportion will fall back to 1000.
        @return amount The amount of tokens that can be claimed.
    */
    function getClaimableAmount(
        address _holder,
        uint256 _amount,
        uint256 _project,
        uint256 _proportion
    ) public view override returns (uint256) {
        // the issuer's tickets, if they've been issued.
        Tickets _tickets = tickets[_project];

        // If there are no tickets, return zero.
        if (_tickets == Tickets(0)) return 0;

        // Get the total supply from the ticket.
        uint256 _totalSupply = _tickets.totalSupply();

        // Nothing is claimable if there are no tickets or iOweYou's.
        if (_totalSupply == 0) return 0;

        // Make sure the specified amount is available.
        require(
            // Get the amount of tickets the specified holder has access to, or is owed.
            _tickets.balanceOf(_holder) >= _amount,
            "TicketStore::getClaimableRewardsAmount: INSUFFICIENT_FUNDS"
        );

        return
            Math.mulDiv(
                DSMath.wdiv(
                    DSMath.wmul(claimable[_project], _amount),
                    _totalSupply
                ),
                // The amount claimable is a function of a bonding curve unless the last tickets are being redeemed.
                _amount == _totalSupply ? 1000 : _proportion,
                1000
            );
    }

    // --- external transactions --- //

    constructor() {}

    /**
        @notice Issues a project's Tickets that'll be handed out by their budgets in exchange for payments.
        @dev Deploys an owner's Ticket ERC-20 token contract.
        @param _project The project of the tickets being issued.
        @param _name The ERC-20's name.
        @param _symbol The ERC-20's symbol.
    */
    function issue(
        uint256 _project,
        string memory _name,
        string memory _symbol
    ) external override onlyAdmin {
        // An owner only needs to issue their Tickets once before they can be used.
        require(
            tickets[_project] == Tickets(0),
            "TicketStore::issue: ALREADY_ISSUED"
        );

        // Create the contract in this Juicer contract in order to have mint and burn privileges.
        // Prepend the strings with standards.
        Tickets _tickets = new Tickets(_name, _symbol);

        tickets[_project] = _tickets;

        emit Issue(_project, _tickets.name(), _tickets.symbol());
    }

    /** 
      @notice Mints new ERC-20 tickets, or increments the IOweYou count.
      @param _project The project of the tickets being minted.
      @param _holder The address receiving the minted tickets.
      @param _amount The amount of tickets being minted.
    */
    function print(
        uint256 _project,
        address _holder,
        uint256 _amount
    ) external override onlyAdmin {
        Tickets _tickets = tickets[_project];

        // Tickets must be issued.
        require(_tickets != Tickets(0), "TicketStore::print: NOT_FOUND");

        // Mint tickets.
        _tickets.mint(_holder, _amount);
    }

    /** 
      @notice Redeems tickets.
      @param _project The project of the tickets being redeemed.
      @param _holder The address redeeming tickets.
      @param _amount The amount of tickets being redeemed.
      @param _minClaimed The minimun amount of claimed tokens to receive in return.
      @param _proportion The proportion of claimable tokens to redeem for the specified amount of tickets.
      @return claimableAmount The amount that is being claimed.
      @return outOf The total amount that is claimable.
    */
    function redeem(
        uint256 _project,
        address _holder,
        uint256 _amount,
        uint256 _minClaimed,
        uint256 _proportion
    )
        external
        override
        onlyAdmin
        returns (uint256 claimableAmount, uint256 outOf)
    {
        require(_minClaimed > 0, "TicketStore::redeem: BAD_AMOUNT");

        // The amount of tokens claimable by the message sender from the specified issuer by redeeming the specified amount.
        claimableAmount = getClaimableAmount(
            _holder,
            _amount,
            _project,
            _proportion
        );

        // The amount being claimed must be less than the amount claimable.
        require(
            claimableAmount >= _minClaimed,
            "TicketStore::redeem: INSUFFICIENT_FUNDS"
        );

        // Burn the tickets.
        tickets[_project].burn(_holder, _amount);

        // Return the total amount claimable before changing the state.
        outOf = totalClaimable;

        // Subtract the claimed tokens from the total amount claimable.
        claimable[_project] = claimable[_project].sub(claimableAmount);
        totalClaimable = totalClaimable.sub(claimableAmount);
    }

    /**
        @notice Adds an amount to the total that can be claimed by redeeming the given issuer's Tickets.
        @param _project The project of the Ticket.
        @param _amount The amount to increment.
    */
    function addClaimable(uint256 _project, uint256 _amount)
        external
        override
        onlyAdmin
    {
        claimable[_project] = claimable[_project].add(_amount);
        totalClaimable = totalClaimable.add(_amount);
    }

    /**
        @notice Clears the amount of claimable tokens the specified issuer has.
        @param _project The project of the Ticket.
        @return amount The amount cleared.
    */
    function clearClaimable(uint256 _project)
        external
        override
        onlyAdmin
        returns (uint256 amount)
    {
        amount = claimable[_project];
        claimable[_project] = 0;
        totalClaimable = totalClaimable.sub(amount);
    }
}
