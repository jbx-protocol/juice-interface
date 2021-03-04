// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

import "./IStore.sol";
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
        uint256 o,
        uint256 b,
        address bAddress
    );

    function latestBudgetId(address _owner) external returns (uint256);

    function votes(
        uint256 _budgetId,
        uint256 _configured,
        bool _yay
    ) external returns (uint256);

    function votesByAddress(
        uint256 _budgetId,
        uint256 _configured,
        address _voter
    ) external returns (uint256);

    function priceFeeds(uint256 _currency)
        external
        returns (AggregatorV3Interface);

    function budgetCount() external returns (uint256);

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

    function getLatestBudget(address _owner)
        external
        view
        returns (Budget.Data memory);

    function getTappableAmount(uint256 _budgetId, uint256 _withhold)
        external
        view
        returns (uint256);

    function getWeightedRate(
        uint256 _budgetId,
        uint256 _amount,
        uint256 _percent
    ) external view returns (uint256);

    function configure(
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string calldata _name,
        string calldata _link,
        uint256 discountRate,
        uint256 _o,
        uint256 _b,
        address _bAddress
    ) external returns (uint256 id);

    function payProject(
        address _project,
        uint256 _amount,
        uint256 _votingPeriod,
        uint256 _withhold
    )
        external
        returns (
            Budget.Data memory budget,
            uint256 transferAmount,
            uint256 overflow
        );

    function tap(
        uint256 _budgetId,
        address _tapper,
        uint256 _amount,
        uint256 _currency,
        uint256 _withhold
    )
        external
        returns (
            Budget.Data memory budget,
            uint256 ethAmount,
            uint256 overflow
        );

    function addVotes(
        uint256 _budgetId,
        uint256 _configured,
        bool _yay,
        address _voter,
        uint256 _amount
    ) external;

    function addPriceFeed(AggregatorV3Interface _priceFeed, uint256 _currency)
        external;
}
