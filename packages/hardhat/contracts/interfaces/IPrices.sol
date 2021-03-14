// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

interface IPrices {
    event AddFeed(uint256 indexed currency, AggregatorV3Interface indexed feed);

    function feeds(uint256 _currency) external returns (AggregatorV3Interface);

    function getETHPrice(uint256 _currency) external view returns (uint256);

    function addFeed(AggregatorV3Interface _priceFeed, uint256 _currency)
        external;
}
