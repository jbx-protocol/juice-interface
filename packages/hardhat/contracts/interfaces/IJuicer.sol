// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./ITicketBooth.sol";
import "./IFundingCycles.sol";
import "./IYielder.sol";
import "./IProjects.sol";
import "./IModStore.sol";
import "./ITerminal.sol";
import "./ITerminalDirectory.sol";
import "./IOperatorStore.sol";

struct FundingCycleMetadata {
    uint256 reservedRate;
    uint256 bondingCurveRate;
    uint256 reconfigurationBondingCurveRate;
}

interface IJuicer {
    event Configure(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
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

    event PrintTickets(
        uint256 indexed projectId,
        address indexed beneficiary,
        uint256 amount,
        string memo,
        address caller
    );

    event Deposit(uint256 amount);

    event SetYielder(IYielder newYielder);

    event SetFee(uint256 _amount);

    event SetTargetLocalETH(uint256 amount);

    function governance() external view returns (address payable);

    function pendingGovernance() external view returns (address payable);

    function projects() external view returns (IProjects);

    function fundingCycles() external view returns (IFundingCycles);

    function ticketBooth() external view returns (ITicketBooth);

    function prices() external view returns (IPrices);

    function terminalDirectory() external view returns (ITerminalDirectory);

    function yielder() external view returns (IYielder);

    function modStore() external view returns (IModStore);

    function targetLocalETH() external view returns (uint256);

    function reservedTicketAmountOf(uint256 _projectId, uint256 _reservedRate)
        external
        view
        returns (uint256);

    function balanceOf(uint256 _projectId) external view returns (uint256);

    function currentOverflowOf(uint256 _projectId)
        external
        view
        returns (uint256);

    function claimableOverflowOf(
        address _account,
        uint256 _amount,
        uint256 _projectId
    ) external view returns (uint256);

    function balance()
        external
        view
        returns (uint256 amountWithoutYield, uint256 amountWithYield);

    function fee() external view returns (uint256);

    function deploy(
        address _owner,
        bytes32 _handle,
        string calldata _uri,
        FundingCycleProperties calldata _properties,
        FundingCycleMetadata calldata _metadata,
        PaymentMod[] memory _paymentMods,
        TicketMod[] memory _ticketMods
    ) external;

    function configure(
        uint256 _projectId,
        FundingCycleProperties calldata _properties,
        FundingCycleMetadata calldata _metadata,
        PaymentMod[] memory _paymentMods,
        TicketMod[] memory _ticketMods
    ) external returns (uint256 fundingCycleId);

    function printTickets(
        uint256 _projectId,
        uint256 _amount,
        address _beneficiary,
        string memory _memo,
        bool _preferUnstakedTickets
    ) external;

    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedEth
    ) external;

    function redeem(
        address _account,
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedETH,
        address payable _beneficiary,
        bool _preferUnstaked
    ) external returns (uint256 returnAmount);

    function printReservedTickets(uint256 _projectId)
        external
        returns (uint256 reservedTicketsToPrint);

    function setFee(uint256 _fee) external;

    function appointGovernance(address payable _pendingGovernance) external;

    function setYielder(IYielder _yielder) external;

    function deposit() external;

    function setTargetLocalETH(uint256 _amount) external;

    function acceptGovernance() external;
}
