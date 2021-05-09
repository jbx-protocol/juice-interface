// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./libraries/CompareMath.sol";

import "./abstract/Administered.sol";
import "./interfaces/IERC20Ticket.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/** 
  @notice A token that can be minted in exchange for something.
*/
contract ERC20Ticket is ERC20, IERC20Ticket, Ownable {
    constructor(string memory _name, string memory _symbol)
        public
        ERC20(_name, _symbol)
    {}

    function print(address _account, uint256 _amount)
        external
        override
        onlyOwner
    {
        return _mint(_account, _amount);
    }

    function redeem(address _account, uint256 _amount)
        external
        override
        onlyOwner
    {
        return _burn(_account, _amount);
    }

    function migrate(address _to) external override onlyOwner {
        transferOwnership(_to);
    }
}
