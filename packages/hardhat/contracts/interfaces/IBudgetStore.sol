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
        address indexed owner,
        uint256 indexed target,
        uint256 currency,
        uint256 duration,
        string name,
        string link,
        uint256 discountRate,
        uint256 bondingCurveRate,
        uint256 reserved,
        address donationRecipient,
        uint256 donationAmount
    );

    function latestBudgetId(address _owner) external view returns (uint256);

    function budgetCount() external view returns (uint256);

    function prices() external view returns (IPrices);

    function budgetBallot() external view returns (IBudgetBallot);

    function fee() external view returns (uint256);

    function getBudget(uint256 _budgetId)
        external
        view
        returns (Budget.Data memory);

    function getQueuedBudget(address _owner)
        external
        view
        returns (Budget.Data memory);

    function getCurrentBudget(address _owner)
        external
        view
        returns (Budget.Data memory);

    function configure(
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string calldata _name,
        string calldata _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved,
        address _donationRecipient,
        uint256 _donationAmount
    ) external returns (uint256 id);

    function payProject(address _project, uint256 _amount)
        external
        returns (
            Budget.Data memory budget,
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
}
