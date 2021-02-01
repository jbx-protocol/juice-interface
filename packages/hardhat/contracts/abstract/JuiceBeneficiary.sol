// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./../interfaces/IJuicer.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract JuiceBeneficiary {
    /** 
      @notice Redeem tickets that have been transfered to this contract.
      @param _issuer The issuer who's tickets are being redeemed.
      @param _amount The amount being redeemed.
      @param _minRewardAmount The minimum amount of rewards tokens expected in return.
      @param _juicer The Juicer to redeem from.
      @return _rewardToken The token that tickets were redeemed for.
    */
    function redeemTickets(
        address _issuer,
        uint256 _amount,
        uint256 _minRewardAmount,
        IJuicer _juicer
    ) external returns (IERC20 _rewardToken) {
        _rewardToken = _juicer.redeem(
            _issuer,
            _amount,
            _minRewardAmount,
            address(this)
        );
    }
}
