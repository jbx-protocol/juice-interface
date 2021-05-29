// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

interface IPrices {
    event AddFeed(uint256 indexed currency, AggregatorV3Interface indexed feed);

    function feedDecimalAdjuster(uint256 _currency) external returns (uint256);

    function targetDecimals() external returns (uint256);

    function feeds(uint256 _currency) external returns (AggregatorV3Interface);

    function getETHPrice(uint256 _currency) external view returns (uint256);

    function addFeed(AggregatorV3Interface _priceFeed, uint256 _currency)
        external;
}
