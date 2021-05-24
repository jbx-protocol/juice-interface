// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./ITickets.sol";
import "./IFundingCycles.sol";
import "./IYielder.sol";
import "./IProjects.sol";
import "./IModStore.sol";
import "./IJuiceTerminal.sol";
import "./IJuiceTerminalDirectory.sol";
import "./IOperatorStore.sol";

struct FundingCycleMetadata {
    uint16 bondingCurveRate;
    uint16 reservedRate;
    uint16 reconfigurationBondingCurveRate;
}

interface IJuicer {
    event Reconfigure(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        uint256 target,
        uint256 currency,
        uint256 duration,
        uint256 discountRate,
        FundingCycleMetadata metadata,
        IFundingCycleBallot ballot,
        address caller
    );

    event Tap(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        address indexed beneficiary,
        uint256 amount,
        uint256 currency,
        uint256 transferAmount,
        uint256 beneficiaryTransferAmount,
        uint256 govFeeAmount,
        address caller
    );
    event Redeem(
        address indexed holder,
        address indexed beneficiary,
        uint256 indexed _projectId,
        uint256 amount,
        uint256 returnAmount,
        address caller
    );

    event PrintReserveTickets(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        address indexed beneficiary,
        uint256 count,
        uint256 beneficiaryTicketAmount,
        address caller
    );

    event ModDistribution(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        address indexed beneficiary,
        uint256 percent,
        uint256 modCut,
        uint256 total
    );
    event AppointGovernance(address governance);

    event AcceptGovernance(address governance);

    event Migrate(
        uint256 indexed projectId,
        IJuiceTerminal indexed to,
        uint256 _amount,
        address caller
    );

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
        address caller
    );

    event AddToMigrationAllowList(address allowed);

    event Deposit(uint256 amount);

    event SetYielder(IYielder newYielder);

    event SetFee(uint256 _amount);

    event SetTargetLocalETH(uint256 amount);

    function governance() external view returns (address payable);

    function pendingGovernance() external view returns (address payable);

    function projects() external view returns (IProjects);

    function fundingCycles() external view returns (IFundingCycles);

    function tickets() external view returns (ITickets);

    function operatorStore() external view returns (IOperatorStore);

    function prices() external view returns (IPrices);

    function terminalDirectory()
        external
        view
        returns (IJuiceTerminalDirectory);

    function yielder() external view returns (IYielder);

    function modStore() external view returns (IModStore);

    function targetLocalETH() external view returns (uint256);

    function reservedTicketAmount(uint256 _projectId, uint256 _reservedRate)
        external
        view
        returns (uint256);

    function balanceOf(uint256 _projectId) external view returns (uint256);

    function currentOverflowOf(uint256 _projectId)
        external
        view
        returns (uint256);

    function balance()
        external
        view
        returns (uint256 amountWithoutYield, uint256 amountWithYield);

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

    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedEth
    ) external;

    function migrate(uint256 _projectId, IJuiceTerminal _to) external;

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

    function claimableOverflow(
        address _account,
        uint256 _amount,
        uint256 _projectId
    ) external view returns (uint256);

    function redeem(
        address _account,
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedETH,
        address payable _beneficiary
    ) external returns (uint256 returnAmount);

    function printReservedTickets(uint256 _projectId)
        external
        returns (uint256 reservedTicketsToPrint);

    function allowMigration(address _contract) external;

    function setFee(uint256 _fee) external;

    function appointGovernance(address payable _pendingGovernance) external;

    function setYielder(IYielder _yielder) external;

    function deposit() external;

    function setTargetLocalETH(uint256 _amount) external;

    function acceptGovernance() external;
}
