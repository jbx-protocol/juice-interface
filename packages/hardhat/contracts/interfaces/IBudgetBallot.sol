// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ITimelockStaker.sol";
import "./IJuicer.sol";

interface IBudgetBallot {
    event Vote(
        address voter,
        uint256 budgetId,
        uint256 configured,
        bool yay,
        uint256 amount
    );

    function juicer() external view returns (IJuicer);

    function staker() external view returns (ITimelockStaker);

    function vote(
        uint256 _budgetId,
        bool _yay,
        uint256 _amount
    ) external;
}
