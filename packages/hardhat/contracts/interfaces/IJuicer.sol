// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./IERC1155Tickets.sol";
import "./IFundingCycles.sol";
import "./IYielder.sol";
import "./IProjects.sol";
import "./IERC20Ticket.sol";

struct FundingCycleMetadata {
    uint16 bondingCurveRate;
    uint16 reservedRate;
}

interface IFundingCyclesController {
    event Reconfigure(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        address indexed operator,
        uint256 target,
        uint256 currency,
        uint256 duration,
        uint256 discountRate,
        FundingCycleMetadata metadata,
        IFundingCycleBallot ballot
    );

    event Pay(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        address indexed payer,
        address beneficiary,
        uint256 amount,
        uint256 currency,
        string note,
        uint256 fee
    );

    event Tap(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        address indexed beneficiary,
        address operator,
        uint256 amount,
        uint256 currency,
        uint256 tappedAmount,
        uint256 transferAmount
    );

    function fee() external view returns (uint256);

    function reconfigure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        FundingCycleMetadata memory _metadata,
        IFundingCycleBallot _ballot
    ) external returns (uint256 fundingCycleId);

    function pay(
        uint256 _projectId,
        address _beneficiary,
        string memory _note
    ) external payable returns (uint256 fundingCycleId);

    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _currency,
        address payable _beneficiary,
        uint256 _minReturnedEth
    ) external;

    function prices() external view returns (IPrices);
}

interface ITicketsController {
    event Redeem(
        address indexed holder,
        address indexed beneficiary,
        uint256 indexed _projectId,
        address operator,
        uint256 amount,
        uint256 returnAmount
    );

    function claimableAmount(
        address _account,
        uint256 _amount,
        uint256 _projectId
    ) external view returns (uint256);

    function redeem(
        address _account,
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedETH,
        address payable _beneficiary,
        bool _erc20
    ) external returns (uint256 returnAmount);
}

interface IJuicer is IFundingCyclesController, ITicketsController {
    event Migrate(
        uint256 indexed projectId,
        address indexed operator,
        IJuicer indexed to,
        uint256 _amount
    );

    event AddToBalance(uint256 indexed projectId, address sender);

    event Deploy(
        uint256 indexed projectId,
        address indexed owner,
        address indexed operator,
        uint256 fundingCycleId,
        string name,
        string handle,
        string logoUri,
        string link,
        uint256 target,
        uint256 currency,
        uint256 duration,
        uint256 discountRate,
        FundingCycleMetadata metadata,
        IFundingCycleBallot ballot
    );

    event AddToMigrationAllowList(address indexed allowed);

    event Deposit(uint256 amount);

    event AddOperator(address account, address operator);

    event RemoveOperator(address account, address operator);

    event SetAdmin(address admin);

    event Issue(uint256 projectId, address issuer, string name, string symbole);

    function admin() external view returns (address payable);

    function operators(address _account, address _operator)
        external
        view
        returns (bool);

    function projects() external view returns (IProjects);

    function fundingCycles() external view returns (IFundingCycles);

    function tickets() external view returns (IERC1155Tickets);

    function yielder() external view returns (IYielder);

    function erc20Tickets(uint256 _projectId)
        external
        view
        returns (IERC20Ticket);

    function balanceOf(uint256 _projectId, bool _includeYield)
        external
        view
        returns (uint256);

    function currentOverflowOf(uint256 _projectId)
        external
        view
        returns (uint256);

    function balance(bool _includeYield) external view returns (uint256);

    function migrated(uint256 _projectId) external view returns (bool);

    function setAdmin(address payable _admin) external;

    function migrate(uint256 _projectId, IJuicer _to) external;

    function deploy(
        address _owner,
        string memory _name,
        string memory _handle,
        string memory _logoUri,
        string memory _link,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        FundingCycleMetadata memory _metadata,
        IFundingCycleBallot _ballot
    ) external;

    function issue(
        uint256 _projectId,
        string memory _name,
        string memory _symbol
    ) external;

    function convertToERC20(address _account, uint256 _projectId) external;

    function addToBalance(uint256 _projectId) external payable;

    function addOperator(address _operator) external;

    function removeOperator(address _operator) external;

    function deposit(uint256 _amount) external;

    function allowMigration(address _contract) external;
}
