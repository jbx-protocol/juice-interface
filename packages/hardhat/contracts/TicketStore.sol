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

    mapping(address => mapping(address => uint256)) public override iOweYous;

    mapping(address => uint256) public override totalIOweYous;

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
        Tickets _tickets =
            iOweYous[_issuer][_holder] == 0 ? tickets[_issuer] : Tickets(0);

        uint256 _totalSupply =
            _tickets != Tickets(0)
                ? _tickets.totalSupply()
                : totalIOweYous[_issuer];

        if (_totalSupply == 0) return 0;

        uint256 _currentBalance =
            _tickets != Tickets(0)
                ? _tickets.balanceOf(_holder)
                : iOweYous[_issuer][_holder];

        require(
            _amount <= _currentBalance,
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
        @param _name The ERC-20's name.
        @param _symbol The ERC-20's symbol.
    */
    function issue(string calldata _name, string calldata _symbol)
        external
        override
    {
        // An owner only needs to issue their Tickets once before they can be used.
        require(
            tickets[msg.sender] == Tickets(0),
            "TicketStore::issue: ALREADY_ISSUED"
        );

        // Create the contract in this Juicer contract in order to have mint and burn privileges.
        tickets[msg.sender] = new Tickets(_name, _symbol);

        emit Issue(msg.sender, _name, _symbol);
    }

    function claimIOweYou(address _issuer) external {
        Tickets _tickets = tickets[_issuer];
        require(
            _tickets != Tickets(0),
            "TicketStore::claimIOweYou: NOT_CLAIMABLE"
        );

        uint256 _amount = iOweYous[_issuer][msg.sender];

        if (_amount == 0) return;

        iOweYous[_issuer][msg.sender] = 0;
        totalIOweYous[_issuer] = totalIOweYous[_issuer].sub(_amount);
        _tickets.mint(msg.sender, _amount);
    }

    function mint(
        address _issuer,
        address _for,
        uint256 _amount
    ) external override onlyAdmin {
        Tickets _tickets = tickets[_issuer];
        uint256 _iOweYou = iOweYous[_issuer][_for];
        if (_iOweYou == 0 && _tickets != Tickets(0)) {
            _tickets.mint(_for, _amount);
        } else {
            iOweYous[_issuer][_for] = _iOweYou.add(_amount);
            totalIOweYous[_issuer] = totalIOweYous[_issuer].add(_amount);
        }
    }

    function redeem(
        address _issuer,
        address _holder,
        uint256 _amount,
        uint256 _minReturn,
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
            returnAmount >= _minReturn,
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
}
