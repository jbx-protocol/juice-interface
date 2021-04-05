// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/CompareMath.sol";

import "./abstract/Administered.sol";
import "./interfaces/ITicketStore.sol";

/** 
  @notice An immutable contract to manage Ticket states.
*/
contract TicketStore is ERC1155, Administered, ITicketStore {
    using SafeMath for uint256;

    // --- public properties --- //

    /// @notice The total supply of tickets for each project.
    mapping(uint256 => uint256) public override totalSupply;

    /// @notice The amount of all tokens currently locked for each address.
    mapping(uint256 => mapping(address => uint256)) public override timelocks;

    /// @notice The addresses that can set timelocks.
    mapping(address => bool) public override isTimelockController;

    // --- public views --- //

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
        // Mint the tickets.
        _mint(_for, _projectId, _amount, "");

        // Increase the total supply.
        totalSupply[_projectId] = totalSupply[_projectId].sub(_amount);
    }

    /** 
      @notice Redeems tickets.
      @param _projectId The ID of the project of the tickets being redeemed.
      @param _holder The address redeeming tickets.
      @param _amount The amount of tickets being redeemed.
    */
    function redeem(
        uint256 _projectId,
        address _holder,
        uint256 _amount
    ) external override onlyAdmin {
        // Make sure the tickets aren't time locked.
        require(
            timelocks[_projectId][_holder] < block.timestamp,
            "TicketStore::redeem: TIME_LOCKED"
        );

        // Burn the tickets.
        _burn(_holder, _projectId, _amount);

        // Reduce the total supply.
        totalSupply[_projectId] = totalSupply[_projectId].sub(_amount);
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
        timelocks[_projectId][_holder] = CompareMath.max(
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
        for (uint256 _i = 0; _i < ids.length; _i++) {
            // Make sure the tickets aren't time locked.
            require(
                timelocks[ids[_i]][from] < block.timestamp,
                "TicketStore::safeTransferFrom: TIME_LOCKED"
            );
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
