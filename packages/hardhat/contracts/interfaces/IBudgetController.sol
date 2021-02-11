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
        uint256 discountRate,
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

    function getWantTokenAllowList() external view returns (IERC20[] memory);

    function STANDBY_PERIOD() external view returns (uint256);

    function configureBudget(
        uint256 _target,
        uint256 _duration,
        IERC20 _want,
        string calldata _link,
        uint256 discountRate,
        uint256 _o,
        uint256 _b,
        address _bAddress
    ) external returns (uint256 mpBudget);

    function payOwner(
        address _owner,
        uint256 _amount,
        IERC20 _token,
        address _beneficiary
    ) external returns (uint256 budgetId);

    function tapBudget(
        uint256 _budgetId,
        uint256 _amount,
        address _beneficiary
    ) external;

    function setWantTokenAllowList(IERC20[] calldata _list) external;
}
