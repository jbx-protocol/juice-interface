// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./IStore.sol";
import "./IPrices.sol";
import "./IBudgetBallot.sol";
import "../libraries/Budget.sol";

interface IBudgetStore is IStore {
    event Configure(
        uint256 indexed budgetId,
        bytes32 indexed project,
        uint256 indexed target,
        uint256 currency,
        uint256 duration,
        string name,
        string link,
        uint256 discountRate,
        uint256 bondingCurveRate,
        uint256 reserved
    );

    event TransferOwnership(
        bytes32 indexed _project,
        address indexed _from,
        address indexed _to
    );

    function latestBudgetId(bytes32 _project) external view returns (uint256);

    function projectOwner(bytes32 _project) external view returns (address);

    function budgetCount() external view returns (uint256);

    function prices() external view returns (IPrices);

    function budgetBallot() external view returns (IBudgetBallot);

    function fee() external view returns (uint256);

    function getBudget(uint256 _budgetId)
        external
        view
        returns (Budget.Data memory);

    function getQueuedBudget(bytes32 _project)
        external
        view
        returns (Budget.Data memory);

    function getCurrentBudget(bytes32 _project)
        external
        view
        returns (Budget.Data memory);

    function configure(
        bytes32 _project,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string calldata _name,
        string calldata _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved
    ) external returns (bytes32 project);

    function payProject(bytes32 _project, uint256 _amount)
        external
        returns (
            Budget.Data memory budget,
            address owner,
            uint256 convertedCurrencyAmount,
            uint256 overflow
        );

    function tap(
        uint256 _budgetId,
        address _tapper,
        uint256 _amount,
        uint256 _currency
    )
        external
        returns (
            Budget.Data memory budget,
            uint256 convertedEthAmount,
            uint256 overflow
        );

    function setFee(uint256 _fee) external;

    function setBudgetBallot(IBudgetBallot _budgetBallot) external;

    function transferProjectOwnership(bytes32 _project, address _newOwner)
        external;
}
