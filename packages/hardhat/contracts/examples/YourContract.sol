// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "../abstract/JuiceAdmin.sol";

/// @dev This contract is an example of how you can use Juice to fund your own project.
contract YourContract is JuiceAdmin {
    constructor(
        IJuicer _controller,
        IERC20 _want,
        string memory _ticketName,
        string memory _ticketSymbol,
        IERC20 _ticketReward,
        UniswapV2Router02 _router
    )
        public
        JuiceAdmin(
            _controller,
            _ticketName,
            _ticketSymbol,
            _ticketReward,
            _router
        )
    {}
}
