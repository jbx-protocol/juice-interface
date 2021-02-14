// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/** 
  @notice A token that can be minted in exchange for something.
  @dev The issuer of the Tickets is the only address that can mint and burn.
*/
contract Tickets is ERC20, Ownable {
    constructor(string memory _name, string memory _symbol)
        public
        ERC20(_name, _symbol)
    {}

    function mint(address _account, uint256 _amount) external onlyOwner {
        return _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) external onlyOwner {
        return _burn(_account, _amount);
    }
}
