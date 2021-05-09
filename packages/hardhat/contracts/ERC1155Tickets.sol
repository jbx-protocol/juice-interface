// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/CompareMath.sol";

import "./abstract/Administered.sol";
import "./interfaces/IERC1155Tickets.sol";

/** 
  @notice An immutable contract to manage Ticket states.
*/
contract ERC1155Tickets is ERC1155, Administered, IERC1155Tickets {
    using SafeMath for uint256;

    // --- public properties --- //

    /// @notice The total supply of tickets for each project.
    mapping(uint256 => uint256) public override totalSupply;

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
        totalSupply[_projectId] = totalSupply[_projectId].add(_amount);
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
        // Burn the tickets.
        _burn(_holder, _projectId, _amount);

        // Reduce the total supply.
        totalSupply[_projectId] = totalSupply[_projectId].sub(_amount);
    }
}
