// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/DSMath.sol";
import "./libraries/Math.sol";

import "./abstract/Administered.sol";
import "./interfaces/ITicketStore.sol";

/** 
  @notice An immutable contract to manage Ticket states.
*/
contract TicketStore is ERC1155, Administered, ITicketStore {
    using SafeMath for uint256;

    // --- public properties --- //

    /// @notice The current cumulative amount of tokens redeemable by each project's Tickets.
    mapping(uint256 => uint256) public override claimable;

    /// @notice The current cumulative amount of tokens redeemable in the system.
    uint256 public override totalClaimable = 0;

    /// @notice The total supply of tickets for each project.
    mapping(uint256 => uint256) public override totalSupply;

    /// @notice The amount of all tokens currently locked for each address.
    mapping(uint256 => mapping(address => uint256)) public override timelocks;

    /// @notice The addresses that can set timelocks.
    mapping(address => bool) public override isTimelockController;

    // --- external views --- //

    /**
        @notice The amount of tokens that a Ticket can be redeemed for.
        @param _projectId The ID of the project to which the Ticket to get a value for belongs.
        @return _value The value.
    */
    function getTicketValue(uint256 _projectId)
        external
        view
        override
        returns (uint256)
    {
        return claimable[_projectId].div(totalSupply[_projectId]);
    }

    // --- public views --- //

    /**
        @notice The amount of tokens that can be claimed by the given address.
        @param _holder The address to get an amount for.
        @param _amount The amount of Tickets being redeemed.
        Must be within the holder's balance.
        @param _projectId The ID of the project to which the Tickets to get an amount for belong.
        @param _proportion The proportion of the hodler's tickets to make claimable. Out of 1000.
        This creates an opportunity for incenvizing HODLing.
        If the specified `_holder` is the last holder, the proportion will fall back to 1000.
        @return amount The amount of tokens that can be claimed.
    */
    function getClaimableAmount(
        address _holder,
        uint256 _amount,
        uint256 _projectId,
        uint256 _proportion
    ) public view override returns (uint256) {
        // Get the total supply from the ticket.
        uint256 _totalSupply = totalSupply[_projectId];

        // Nothing is claimable if there are no tickets or iOweYou's.
        if (_totalSupply == 0) return 0;

        // Make sure the specified amount is available.
        require(
            // Get the amount of tickets the specified holder has access to, or is owed.
            balanceOf(_holder, _projectId) >= _amount,
            "TicketStore::getClaimableRewardsAmount: INSUFFICIENT_FUNDS"
        );

        return
            Math.mulDiv(
                DSMath.wdiv(
                    DSMath.wmul(claimable[_projectId], _amount),
                    _totalSupply
                ),
                // The amount claimable is a function of a bonding curve unless the last tickets are being redeemed.
                _amount == _totalSupply ? 1000 : _proportion,
                1000
            );
    }

    // --- external transactions --- //

    constructor() ERC1155("") {}

    /** 
      @notice Print new tickets.
      @param _for The address receiving the new tickets.
      @param _projectId The project to which the tickets belong.
      @param _amount The amount to print.
    */
    function print(
        address _for,
        uint256 _projectId,
        uint256 _amount
    ) external override onlyAdmin {
        _mint(_for, _projectId, _amount, "");
    }

    /** 
      @notice Print many new tickets.
      @param _for The address receiving the new tickets.
      @param _projectIds The projects to which the tickets belong.
      @param _amounts The amounts to print, corresponding to the projectIds.
    */
    function printMany(
        address _for,
        uint256[] calldata _projectIds,
        uint256[] calldata _amounts
    ) external override onlyAdmin {
        _mintBatch(_for, _projectIds, _amounts, "");
    }

    /** 
      @notice Redeems tickets.
      @param _projectId The ID of the project of the tickets being redeemed.
      @param _holder The address redeeming tickets.
      @param _amount The amount of tickets being redeemed.
      @param _minClaimed The minimun amount of claimed tokens to receive in return.
      @param _proportion The proportion of claimable tokens to redeem for the specified amount of tickets.
      @return claimableAmount The amount that is being claimed.
      @return outOf The total amount that is claimable.
    */
    function redeem(
        uint256 _projectId,
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

        // Make sure the tickets aren't time locked.
        require(
            timelocks[_projectId][_holder] < block.timestamp,
            "TicketStore::redeem: TIME_LOCKED"
        );

        // The amount of tokens claimable by the message sender from the specified issuer by redeeming the specified amount.
        claimableAmount = getClaimableAmount(
            _holder,
            _amount,
            _projectId,
            _proportion
        );

        // The amount being claimed must be less than the amount claimable.
        require(
            claimableAmount >= _minClaimed,
            "TicketStore::redeem: INSUFFICIENT_FUNDS"
        );

        // Return the total amount claimable before changing the state.
        outOf = totalClaimable;

        // Subtract the claimed tokens from the total amount claimable.
        claimable[_projectId] = claimable[_projectId].sub(claimableAmount);
        totalClaimable = totalClaimable.sub(claimableAmount);

        // Burn the tickets.
        _burn(_holder, _projectId, _amount);
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

    /**
      @notice Sets a timelock for certain staked tokens within which they can't be unstaked.
      @param _holder The holder of the tokens.
      @param _projectId The id of the project to timelock.
      @param _expiry The time when the lock expires.
    */
    function setTimelock(
        address _holder,
        uint256 _projectId,
        uint256 _expiry
    ) external override {
        require(
            isTimelockController[msg.sender] == true,
            "TicketStore::setTimelock: UNAUTHORIZED"
        );
        //Replace the current timelock if it is after the currently set one.
        timelocks[_projectId][_holder] = Math.max(
            timelocks[_projectId][_holder],
            _expiry
        );
    }

    /**
      @notice Sets the status of a timelock controller.
      @param _controller The address to change the controller status of.
      @param _status The status
    */
    function setTimelockControllerStatus(address _controller, bool _status)
        external
        override
    {
        require(
            msg.sender == owner,
            "TimelockStaker::setController: UNAUTHORIZED"
        );
        isTimelockController[_controller] = _status;
    }

    // --- public transactions --- //

    // Override to prevent transfers from locked tokens.
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override(ERC1155, IERC1155) {
        // Make sure the tickets aren't time locked.
        require(
            timelocks[id][from] < block.timestamp,
            "TicketStore::safeTransferFrom: TIME_LOCKED"
        );
        super.safeTransferFrom(from, to, id, amount, data);
    }

    // Override to prevent transfers from locked tokens.
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override(ERC1155, IERC1155) {
        for (uint256 i = 0; i < ids.length; i++) {
            // Make sure the tickets aren't time locked.
            require(
                timelocks[ids[i]][from] < block.timestamp,
                "TicketStore::safeTransferFrom: TIME_LOCKED"
            );
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
