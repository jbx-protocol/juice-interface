// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
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

    // --- external views --- //

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
    ) external view override returns (uint256) {
        Tickets _tickets = tickets[_issuer];
        uint256 _totalSupply = _tickets.totalSupply();
        if (_totalSupply == 0) return 0;
        uint256 _currentBalance = _tickets.balanceOf(_holder);

        require(
            _amount <= _currentBalance,
            "TicketStore::getClaimableRewardsAmount: INSUFFICIENT_FUNDS"
        );

        // Bonding curve depending on how much is left. This would give holders a slight advantage.

        return
            claimable[_issuer]
                .mul(_amount)
                .div(_totalSupply)
                .mul(_amount < _totalSupply ? _proportion : 1000)
                .div(1000);
    }

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

    // --- external transactions --- //

    constructor() public {}

    /**
        @notice Saves Tickets to storage for the provided issuer.
        @param _issuer The issuer of the Tickets.
        @param _tickets The Tickets to assign to the issuer.
    */
    function saveTickets(address _issuer, Tickets _tickets)
        external
        override
        onlyAdmin
    {
        tickets[_issuer] = _tickets;
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
    }

    /**
        @notice Subtracts an amount to the total that can be claimed by redeeeming the given issuer's Tickets.
        @param _issuer The issuer of the Ticket.
        @param _amount The amount to decrement.
    */
    function subtractClaimable(address _issuer, uint256 _amount)
        external
        override
        onlyAdmin
    {
        claimable[_issuer] = claimable[_issuer].sub(_amount);
    }
}
