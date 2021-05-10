// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./ITickets.sol";
import "./IFundingCycles.sol";
import "./IYielder.sol";
import "./IProjects.sol";
import "./IOperatorStore.sol";

struct FundingCycleMetadata {
    uint16 bondingCurveRate;
    uint16 reservedRate;
}

interface IFundingCyclesController {
    event Reconfigure(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        uint256 target,
        uint256 currency,
        uint256 duration,
        uint256 discountRate,
        FundingCycleMetadata metadata,
        IFundingCycleBallot ballot,
        address operator
    );

    event Pay(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        address indexed beneficiary,
        uint256 amount,
        uint256 currency,
        string note,
        uint256 fee,
        address operator
    );

    event Tap(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        address indexed beneficiary,
        uint256 amount,
        uint256 currency,
        uint256 tappedAmount,
        uint256 transferAmount,
        address operator
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

interface IProjectFundsManager {
    function addToBalance(uint256 _projectId) external payable;
}

interface IJuicer is
    IFundingCyclesController,
    ITicketsController,
    IProjectFundsManager
{
    event Migrate(
        uint256 indexed projectId,
        IProjectFundsManager indexed to,
        uint256 _amount,
        address operator
    );

    event AddToBalance(uint256 indexed projectId, address sender);

    event Deploy(
        uint256 indexed projectId,
        address indexed owner,
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
        IFundingCycleBallot ballot,
        address operator
    );

    event AddToMigrationAllowList(address indexed allowed);

    event Deposit(uint256 amount);

    event SetAdmin(address admin);

    function admin() external view returns (address payable);

    function projects() external view returns (IProjects);

    function fundingCycles() external view returns (IFundingCycles);

    function tickets() external view returns (ITickets);

    function operatorStore() external view returns (IOperatorStore);

    function yielder() external view returns (IYielder);

    function balanceOf(uint256 _projectId, bool _includeYield)
        external
        view
        returns (uint256);

    function currentOverflowOf(uint256 _projectId)
        external
        view
        returns (uint256);

    function balance(bool _includeYield) external view returns (uint256);

    function setAdmin(address payable _admin) external;

    function migrate(uint256 _projectId, IProjectFundsManager _to) external;

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

    function deposit(uint256 _amount) external;

    function allowMigration(address _contract) external;
}
