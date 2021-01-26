// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// A contract used for local dev as a `want` token.
contract Token is ERC20 {
    uint256 INITIAL_SUPPLY = 100000;

    constructor() public ERC20("Token", "TOKEN") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function gimme(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }
}
