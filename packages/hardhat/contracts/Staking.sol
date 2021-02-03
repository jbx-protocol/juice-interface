// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract Staking {
    /// @notice The amount of all tokens currently staked by each address.
    mapping(IERC20 => mapping(address => uint256)) staked;

    /// @notice The amount of all tokens currently locked .
    mapping(IERC20 => mapping(uint256 => mapping(address => uint256))) timelocks;

    function stake(address _issuer, uint256 _amount)
        external
        override
        lock
        returns (uint256)
    {
        // Find the tickets for the issuer.
        ITickets _tickets = ticketStore.tickets(_issuer);

        // The message sender should have more than the amount being staked.
        require(
            _tickets.balanceOf(msg.sender) >= _amount,
            "Juicer::stake: INSUFFICIENT_FUNDS"
        );

        // Transfer the funds from the message sender to this address.
        IERC20(_tickets).safeTransferFrom(msg.sender, address(this), _amount);

        // Account for the staked tickets.
        _stakedTickets[_tickets][msg.sender] = _stakedTickets[_tickets][
            msg.sender
        ]
            .add(_amount);
    }

    function unstake(address _issuer, uint256 _amount)
        external
        override
        lock
        returns (uint256)
    {
        // Find the tickets for the issuer.
        ITickets _tickets = ticketStore.tickets(_issuer);

        // Tickets cannot be unstaked if they are locked to prevent sybil attacks during voting.
        require(
            _stakingTimelocks[_tickets][msg.sender] < block.timestamp,
            "Juicer::unstake: TIME_LOCKED"
        );

        // There must be enough tickets staked to unstake.
        require(
            _stakedTickets[_tickets][msg.sender] >= _amount,
            "Juicer::unstake: INSUFFICIENT_FUNDS"
        );

        // Account for the difference.
        _stakedTickets[_tickets][msg.sender] = _stakedTickets[_tickets][
            msg.sender
        ]
            .sub(_amount);

        // Transfer the tickets back to the message sender.
        IERC20(_tickets).safeTransfer(msg.sender, _amount);
    }

    function setTimelock(
        IERC20 _tickets,
        uint256 _lockId,
        address _voter
    ) external {
        timelocks[_tickets][_budget.configured][msg.sender] = _budget
            .configured
            .add(STANDBY_PERIOD);
    }
}
