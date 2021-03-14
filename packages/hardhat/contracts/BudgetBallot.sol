// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
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

    /// @notice The amount of time a Budget must be in standby before it can become active.
    /// @dev This allows for a voting period of 3 days.
    uint256 public constant override RECONFIGURATION_VOTING_PERIOD = 604800;

    /// @notice The Juicer for which the budget data is being voted on.
    IJuicer public immutable override juicer;

    /// @notice The contract that manages staking.
    ITimelockStaker public immutable override staker;

    /// @notice The number of yay and nay votes cast for each configuration of each Budget ID.
    mapping(uint256 => mapping(uint256 => mapping(bool => uint256)))
        public
        override votes;

    /// @notice The number of votes cast by each address for each configuration of each Budget ID.
    mapping(uint256 => mapping(uint256 => mapping(address => uint256)))
        public
        override votesByAddress;

    // --- external views --- //

    /**
      @notice Whether or not a reconfiguration of a particular budget is currently approved.
      @param _budgetId The ID of the budget to check the approval of.
      @param _configured The configuration of the budget to check the approval of.
      @return Whether or not the budget reconfiguration is currently approved.
   */
    function isApproved(uint256 _budgetId, uint256 _configured)
        external
        view
        override
        returns (bool)
    {
        //supermajority. must have greater than 66% yays.
        return
            _configured.add(RECONFIGURATION_VOTING_PERIOD) < block.timestamp &&
            votes[_budgetId][_configured][true].mul(3).div(4) >
            votes[_budgetId][_configured][false].mul(3).div(2);
    }

    // --- external transactions --- //

    /** 
      @param _juicer The Juicer contract that manages to Budgets being voted on.
      @param _staker The Staking contract that Ticket holders must lock Ticket into before voting.
    */
    constructor(IJuicer _juicer, ITimelockStaker _staker) {
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
            _budget.configured.add(RECONFIGURATION_VOTING_PERIOD);

        // The vote must be cast before the standy period expires.
        require(
            block.timestamp < _standbyExpiry,
            "BudgetBallot::vote: EXPIRED"
        );

        // Get the Tickets used for the Budget.
        Tickets _tickets = _ticketStore.tickets(_budget.project);

        // Find how many tickets the message sender has staked.
        uint256 _stakedAmount = staker.staked(_tickets, msg.sender);

        // Find how many votes the message sender has already cast.
        uint256 _votedAmount =
            votesByAddress[_budgetId][_budget.configured][msg.sender];

        require(_stakedAmount > _votedAmount, "Juicer::vote: ALREADY_VOTED");

        uint256 _addableVotes = _stakedAmount.sub(_votedAmount);

        require(
            _addableVotes > _amount,
            "Juicer::vote: INSUFFICIENT_VOTE_AMOUNT"
        );

        // Add the votes.
        votes[_budgetId][_budget.configured][_yay] = votes[_budgetId][
            _budget.configured
        ][_yay]
            .add(_amount);
        votesByAddress[_budgetId][_budget.configured][
            msg.sender
        ] = votesByAddress[_budgetId][_budget.configured][msg.sender].add(
            _amount
        );

        // Lock the tickets until the budget's standby period is over.
        staker.setTimelock(_tickets, msg.sender, _standbyExpiry);

        emit Vote(
            msg.sender,
            _budgetId,
            _budget.configured,
            _yay,
            _votedAmount
        );
    }
}
