// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBudgetController {
    event ConfigureBudget(
        uint256 indexed budgetId,
        address indexed owner,
        uint256 indexed target,
        uint256 duration,
        IERC20 want,
        string link,
        uint256 bias,
        uint256 o,
        uint256 b,
        address bAddress
    );

    event SustainBudget(
        uint256 indexed budgetId,
        address indexed owner,
        address indexed beneficiary,
        address sustainer,
        uint256 amount,
        IERC20 want
    );

    event TapBudget(
        uint256 indexed budgetId,
        address indexed owner,
        address indexed beneficiary,
        uint256 amount,
        IERC20 want
    );

    event CleanedTrackedWantedTokens(address indexed owner, IERC20 token);

    function configureBudget(
        uint256 _target,
        uint256 _duration,
        IERC20 _want,
        string calldata _brief,
        string calldata _link,
        uint256 bias,
        uint256 _o,
        uint256 _b,
        address _bAddress
    ) external returns (uint256 _mpBudget);

    function payOwner(
        address _owner,
        uint256 _amount,
        IERC20 _token,
        address _beneficiary
    ) external returns (uint256 _budgetId);

    function tapBudget(
        uint256 _budgetId,
        uint256 _amount,
        address _beneficiary
    ) external;

    function cleanTrackedWantedTokens(address _owner, IERC20 _token) external;
}
