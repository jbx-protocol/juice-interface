// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/ITimelockStaker.sol";
import "./interfaces/IBudgetBallot.sol";

contract BudgetBallot is IBudgetBallot {
    using SafeMath for uint256;
    using Budget for Budget.Data;

    /// @notice The Juicer for which the budget data is being voted on.
    IJuicer public immutable override juicer;

    /// @notice The contract that manages staking.
    ITimelockStaker public immutable override staker;

    constructor(IJuicer _juicer, ITimelockStaker _staker) public {
        // Make this Ballot the timelock controller of the staker contract.
        _staker.setController(address(this));

        juicer = _juicer;
        staker = _staker;
    }

    function vote(
        uint256 _budgetId,
        bool _yay,
        uint256 _amount
    ) external override {
        IBudgetStore _budgetStore = juicer.budgetStore();
        ITicketStore _ticketStore = juicer.ticketStore();

        // Get a reference to the Budget being tapped.
        Budget.Data memory _budget = _budgetStore.getBudget(_budgetId);

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
            _budget.configured.add(juicer.STANDBY_PERIOD())
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
