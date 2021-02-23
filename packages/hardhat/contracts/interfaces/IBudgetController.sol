// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBudgetController {
    event PayOwner(
        uint256 indexed budgetId,
        address indexed owner,
        address indexed payer,
        address beneficiary,
        uint256 amount,
        IERC20 token
    );

    event TapBudget(
        uint256 indexed budgetId,
        address indexed owner,
        address indexed beneficiary,
        uint256 amount,
        IERC20 want
    );

    function RECONFIGURATION_VOTING_PERIOD() external view returns (uint256);

    function payOwner(
        address _owner,
        uint256 _amount,
        address _beneficiary
    ) external returns (uint256 budgetId);

    function tapBudget(
        uint256 _budgetId,
        uint256 _amount,
        address _beneficiary
    ) external;
}
