// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// A contract used for local dev as a `want` token.
contract Token is ERC20 {
    uint256 INITIAL_SUPPLY = 100000;

    constructor() ERC20("Wrapped ETH", "WETH") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function gimme(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }
}
