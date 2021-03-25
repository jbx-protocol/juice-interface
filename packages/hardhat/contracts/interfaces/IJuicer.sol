// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./ITicketStore.sol";
import "./IBudgetStore.sol";
import "./IOverflowYielder.sol";

import "./IProjects.sol";

interface IBudgetController {
    event Reconfigure(
        uint256 indexed budgetId,
        uint256 indexed projectId,
        Budget.Data budget
    );

    event Pay(
        uint256 indexed budgetId,
        uint256 indexed projectId,
        address indexed payer,
        address beneficiary,
        uint256 amount,
        uint256 convertedCurrencyAmount,
        uint256 currency,
        string note,
        uint256 fee
    );

    event Tap(
        uint256 indexed budgetId,
        uint256 indexed projectId,
        address indexed beneficiary,
        address tapper,
        uint256 amount,
        uint256 currency,
        uint256 tappedAmount
    );

    function pay(
        uint256 _projectId,
        uint256 _amount,
        address _beneficiary,
        string memory _note
    ) external returns (uint256 budgetId);

    function tap(
        uint256 _budgetId,
        uint256 _projectId,
        uint256 _amount,
        uint256 _currency,
        address _beneficiary,
        uint256 _minReturnedEth
    ) external;
}

interface ITicketsController {
    event Redeem(
        address indexed holder,
        uint256 indexed _projectId,
        address beneficiary,
        uint256 amount,
        uint256 returnAmount,
        IERC20 returnToken
    );

    function redeem(
        uint256 _projectId,
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

    event Deploy(
        uint256 indexed projectId,
        address indexed owner,
        address indexed deployer,
        string _name,
        string _handle,
        string _logoUri,
        Budget.Data budget
    );

    event AddToMigrationAllowList(address indexed allowed);

    event SetOverflowYielder(IOverflowYielder indexed newOverflowYielder);

    event Deposit(uint256 depositable, IERC20 token);

    function admin() external view returns (address);

    function projects() external view returns (IProjects);

    function budgetStore() external view returns (IBudgetStore);

    function ticketStore() external view returns (ITicketStore);

    function overflowYielder() external view returns (IOverflowYielder);

    function depositable() external view returns (uint256);

    function weth() external view returns (IERC20);

    function getOverflow(uint256 _projectId) external view returns (uint256);

    function getTotalOverflow() external view returns (uint256);

    function setAdmin(address _admin) external;

    function setOverflowYielder(IOverflowYielder _newOverflowYielder) external;

    function migrate(uint256 _projectId, IJuicer _to) external;

    function deploy(
        address _owner,
        string memory _name,
        string memory _handle,
        string memory _logoUri,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string memory _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved
    ) external;

    function reconfigure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string memory _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved,
        IBudgetBallot _ballot
    ) external returns (uint256 budgetId);

    function addOverflow(
        uint256 _projectId,
        uint256 _amount,
        IERC20 _token
    ) external;

    function deposit() external;

    function allowMigration(address _contract) external;
}
