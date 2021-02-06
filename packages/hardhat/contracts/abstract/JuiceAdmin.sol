// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {
    UniswapV2Router02
} from "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./../interfaces/IJuicer.sol";
import "./../interfaces/ITickets.sol";
import "./JuiceBeneficiary.sol";

abstract contract JuiceAdmin is Ownable, JuiceBeneficiary {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct BudgetConfigurationProposal {
        uint256 target;
        uint256 duration;
        IERC20 want;
        string link;
        uint256 discountRate;
        uint256 o;
        uint256 b;
        address bAddress;
    }

    /// @notice The Juicer contract that is being used.
    IJuicer public juicer;

    /// @dev The router to use to execute swaps.
    UniswapV2Router02 public router;

    event WithdrawFees(IERC20 token, uint256 amount, address to);

    constructor(IJuicer _juicer, UniswapV2Router02 _router) internal {
        juicer = _juicer;
        router = _router;
    }

    /**
        @notice This is how the Budget is configured, and reconfiguration over time.
        @param _target The new Budget target amount.
        @param _duration The new duration of your Budget.
        @param _want The new token that your Budget wants.
        @param _link A link to information about the Budget.
        @param _discountRate A number from 70-130 indicating how valuable a Budget is compared to the owners previous Budget,
        effectively creating a recency discountRate.
        If it's 100, each Budget will have equal weight.
        If the number is 130, each Budget will be treated as 1.3 times as valuable than the previous, meaning sustainers get twice as much redistribution shares.
        If it's 0.7, each Budget will be 0.7 times as valuable as the previous Budget's weight.
        @param _o The percentage of this Budget's surplus to allocate to the owner.
        @param _b The percentage of this Budget's surplus to allocate towards a beneficiary address. This can be another contract, or an end user address.
        An example would be a contract that allocates towards a specific purpose, such as Gitcoin grant matching.
        @param _bAddress The address of the beneficiary contract where a specified percentage is allocated.
        @return _budgetId The ID of the Budget that was reconfigured.
    */
    function configureBudget(
        uint256 _target,
        uint256 _duration,
        IERC20 _want,
        string calldata _link,
        uint256 _discountRate,
        uint256 _o,
        uint256 _b,
        address _bAddress
    ) external onlyOwner returns (uint256) {
        return
            juicer.configureBudget(
                _target,
                _duration,
                _want,
                _link,
                _discountRate,
                _o,
                _b,
                _bAddress
            );
    }

    /** 
      @notice Redeem tickets that have been transfered to this contract and use it to fund this contract's budget.
      @param _issuer The issuer who's tickets are being redeemed.
      @param _amount The amount being redeemed.
      @param _minRewardAmount The minimum amount of rewards tokens expected in return.
      @param _minSwappedAmount The minimum amount of this contract's latest `want` token that should be
             swapped to from the redeemed reward.
      @param _juicer The Juicer to redeem from.
    */
    function redeemTicketsAndFund(
        address _issuer,
        uint256 _amount,
        uint256 _minRewardAmount,
        uint256 _minSwappedAmount,
        IJuicer _juicer
    ) external {
        IERC20 _rewardToken =
            redeemTickets(_issuer, _amount, _minRewardAmount, _juicer);

        Budget.Data memory _budget =
            _juicer.budgetStore().getCurrentBudget(address(this));

        require(
            _rewardToken.approve(address(router), _amount),
            "BudgetAdmin::redeemTickets: APPROVE_FAILED."
        );

        address[] memory path = new address[](2);
        path[0] = address(_rewardToken);
        path[1] = router.WETH();
        // Add the destination of the route if it isn't WETH.
        if (address(_budget.want) != router.WETH())
            path[2] = address(_budget.want);
        uint256[] memory _amounts =
            router.swapExactTokensForTokens(
                _amount,
                _minSwappedAmount,
                path,
                address(this),
                block.timestamp
            );

        // Surplus goes back to the issuer.
        _juicer.payOwner(
            address(this),
            _amounts[_amounts.length - 1],
            _budget.want,
            _issuer
        );
    }

    /** 
      @notice Migrates the ability to mint and redeem this contract's Tickets to a new Juicer.
      @dev The destination must be in the current Juicer's allow list.
      @param _to The new contract that will manage your Tickets and it's funds.
    */
    function migrate(IJuicer _to) public onlyOwner {
        require(_to != IJuicer(0), "JuiceAdmin::setJuicer: ZERO_ADDRESS");
        juicer.migrate(address(_to));
        // Sets the Juicer that this contract uses.
        juicer = _to;
    }
}
