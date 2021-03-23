// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./IPrices.sol";
import "./IBudgetBallot.sol";
import "../libraries/Budget.sol";

interface IBudgetStore {
    event Configure(
        uint256 indexed budgetId,
        uint256 indexed projectId,
        uint256 indexed target,
        uint256 currency,
        uint256 duration,
        string name,
        string link,
        uint256 discountRate,
        uint256 bondingCurveRate,
        uint256 reserved,
        IBudgetBallot ballot
    );

    function latestBudgetId(uint256 _project) external view returns (uint256);

    function budgetCount() external view returns (uint256);

    function prices() external view returns (IPrices);

    function projects() external view returns (IERC721);

    function fee() external view returns (uint256);

    function getBudget(uint256 _budgetId)
        external
        view
        returns (Budget.Data memory);

    function getQueuedBudget(uint256 _projectId)
        external
        view
        returns (Budget.Data memory);

    function getCurrentBudget(uint256 _projectId)
        external
        view
        returns (Budget.Data memory);

    function configure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string memory _name,
        string memory _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved,
        IBudgetBallot _ballot
    ) external returns (uint256 budgetId);

    function payProject(uint256 _projectId, uint256 _amount)
        external
        returns (
            Budget.Data memory budget,
            uint256 convertedCurrencyAmount,
            uint256 overflow
        );

    function tap(
        uint256 _budgetId,
        uint256 _projectId,
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
}
