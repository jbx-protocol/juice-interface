// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./ITicketStore.sol";
import "./IBudgetStore.sol";
import "./IOverflowYielder.sol";

interface IBudgetController {
    event Pay(
        uint256 indexed budgetId,
        address indexed project,
        address indexed payer,
        address beneficiary,
        uint256 amount,
        uint256 currencyConvertedAmount,
        uint256 currency,
        string note,
        bool adminFee
    );

    event Tap(
        uint256 indexed budgetId,
        address indexed project,
        address indexed beneficiary,
        uint256 amount,
        uint256 currency,
        uint256 tappedAmount
    );

    function RECONFIGURATION_VOTING_PERIOD() external view returns (uint256);

    function pay(
        address _owner,
        uint256 _amount,
        address _beneficiary,
        string memory _note
    ) external returns (uint256 budgetId);

    function tap(
        uint256 _budgetId,
        uint256 _amount,
        uint256 _currency,
        address _beneficiary,
        uint256 _minReturnedEth
    ) external;
}

interface ITicketsController {
    event Redeem(
        address indexed holder,
        address indexed issuer,
        address beneficiary,
        uint256 amount,
        uint256 returnAmount,
        IERC20 returnToken
    );

    function redeem(
        address _issuer,
        uint256 _amount,
        uint256 _minReturnedETH,
        address _beneficiary
    ) external returns (uint256 returnAmount);
}

interface IJuicer is IBudgetController, ITicketsController {
    event Migrate(IJuicer indexed to, uint256 _amount);

    event Collect(
        address indexed collecter,
        address indexed beneficiary,
        uint256 amount
    );

    event AddToMigrationAllowList(address indexed allowed);

    event SetOverflowYielder(IOverflowYielder indexed newOverflowYielder);

    event SetBondingCurveRate(uint256 rate);

    event Deposit(uint256 depositable, IERC20 token);

    function admin() external view returns (address);

    function budgetStore() external view returns (IBudgetStore);

    function ticketStore() external view returns (ITicketStore);

    function overflowYielder() external view returns (IOverflowYielder);

    function depositable() external view returns (uint256);

    function fee() external view returns (uint256);

    function weth() external view returns (IERC20);

    function bondingCurveRate() external view returns (uint256);

    function getOverflow(address _issuer) external view returns (uint256);

    function getTotalOverflow() external view returns (uint256);

    function setAdmin(address _admin) external;

    function setOverflowYielder(IOverflowYielder _newOverflowYielder) external;

    function migrate(IJuicer _to) external;

    function addOverflow(
        address _issuer,
        uint256 _amount,
        IERC20 _token
    ) external;

    function deposit() external;

    function setBondingCurveRate(uint256 _rate) external;

    function allowMigration(address _contract) external;
}
