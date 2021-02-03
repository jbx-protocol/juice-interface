// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/ITimelockStaker.sol";
import "./interfaces/IBudgetBallot.sol";

/** 
   @notice Manages votes towards approving Budget reconfigurations.
   @dev Once a Budget owner's Ticket holder has staked their tickets in the TimelockStaker, 
        they can vote on reconfigurations to the Budget made by the owner.
 */
contract BudgetBallot is IBudgetBallot {
    using SafeMath for uint256;
    using Budget for Budget.Data;

    /// @notice The Juicer for which the budget data is being voted on.
    IJuicer public immutable override juicer;

    /// @notice The contract that manages staking.
    ITimelockStaker public immutable override staker;

    /** 
      @param _juicer The Juicer contract that manages to Budgets being voted on.
      @param _staker The Staking contract that Ticket holders must lock Ticket into before voting.
    */
    constructor(IJuicer _juicer, ITimelockStaker _staker) public {
        // Make this Ballot the timelock controller of the staker contract.
        _staker.setController(address(this));

        juicer = _juicer;
        staker = _staker;
    }

    /** 
      @notice Vote for yay or nay on a budget reconfiguration proposal.
      @param _budgetId The ID for a Budget with a proposed reconfiguration.
      @param _yay True if voting for the proposal, false if voting against.
      @param _amount The amount of staked tickets to allocate to this vote.
    */
    function vote(
        uint256 _budgetId,
        bool _yay,
        uint256 _amount
    ) external override {
        IBudgetStore _budgetStore = juicer.budgetStore();
        ITicketStore _ticketStore = juicer.ticketStore();

        // Get a reference to the Budget being voted on.
        Budget.Data memory _budget = _budgetStore.getBudget(_budgetId);

        uint256 _standbyExpiry =
            _budget.configured.add(juicer.STANDBY_PERIOD());

        // The vote must be cast before the standy period expires.
        require(now < _standbyExpiry, "BudgetBallot::vote: EXPIRED");

        // Get the Tickets used for the Budget.
        ITickets _tickets = _ticketStore.tickets(_budget.owner);

        // Find how many tickets the message sender has staked.
        uint256 _stakedAmount = staker.staked(_tickets, msg.sender);

        // Find how many votes the message sender has already cast.
        uint256 _votedAmount =
            _budgetStore.votesByAddress(
                _budgetId,
                _budget.configured,
                msg.sender
            );

        require(_stakedAmount > _votedAmount, "Juicer::vote: ALREADY_VOTED");

        uint256 _addableVotes = _stakedAmount.sub(_votedAmount);

        require(
            _addableVotes > _amount,
            "Juicer::vote: INSUFFICIENT_VOTE_AMOUNT"
        );

        // Add the votes.
        _budgetStore.addVotes(
            _budgetId,
            _budget.configured,
            _yay,
            msg.sender,
            _amount
        );

        // Lock the tickets until the budget's standby period is over.
        staker.setTimelock(
            _tickets,
            _budget.configured,
            msg.sender,
            _standbyExpiry
        );

        emit Vote(
            msg.sender,
            _budgetId,
            _budget.configured,
            _yay,
            _votedAmount
        );
    }
}
