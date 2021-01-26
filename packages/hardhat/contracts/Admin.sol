// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./interfaces/IJuicer.sol";
import "./abstract/JuiceAdmin.sol";

/// All functions in here should be governable with FLOW.
/// Owner should eventually change to a governance contract.
contract Admin is JuiceAdmin {
    using SafeERC20 for IERC20;

    /** 
      @param _juicer The juicer that is being administered.
    */
    constructor(
        IJuicer _juicer,
        string memory _name,
        string memory _symbol,
        IERC20 _rewardToken,
        UniswapV2Router02 _router
    ) public JuiceAdmin(_juicer, _name, _symbol, _rewardToken, _router) {}
}
