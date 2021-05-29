// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IPrices.sol";

/** 
  @notice Manage and normalizes ETH price feeds.
*/
contract Prices is IPrices, Ownable {
    // The number to multiply each price feed by to get to the target decimals.
    mapping(uint256 => uint256) public override feedDecimalAdjuster;

    // The target number of decimals the price feed results have.
    uint256 public constant override targetDecimals = 18;

    /// @notice The available price feeds that can be used to get the price of ETH.
    mapping(uint256 => AggregatorV3Interface) public override feeds;

    /** 
      @notice Gets the current price of ETH for the provided currency.
      @param _currency The currency to get a price for.
      @return price The price of ETH with 18 decimals.
    */
    function getETHPrice(uint256 _currency)
        external
        view
        override
        returns (uint256)
    {
        // The 0 currency is ETH itself.
        if (_currency == 0) return 10**targetDecimals;

        // Get a reference to the feed.
        AggregatorV3Interface _feed = feeds[_currency];

        // Feed must exist.
        require(
            _feed != AggregatorV3Interface(address(0)),
            "Prices::getETHPrice: NOT_FOUND"
        );

        // Get the lateset round information. Only need the price is needed.
        (, int256 _price, , , ) = _feed.latestRoundData();

        // Multiply the price by the decimal adjuster to get the normalized result.
        return uint256(_price) * feedDecimalAdjuster[_currency];
    }

    /** 
      @notice Add a price feed for the price of ETH.
      @param _feed The price feed being added.
      @param _currency The currency that the price feed is for.
    */
    function addFeed(AggregatorV3Interface _feed, uint256 _currency)
        external
        override
        onlyOwner
    {
        // The 0 currency is reserved for ETH.
        require(_currency > 0, "Prices::addFeed: RESERVED");

        // Get a reference to the number of decimals the feed uses.
        uint256 _decimals = _feed.decimals();

        // Decimals should be less than or equal to the target number of decimals.
        require(_decimals <= targetDecimals, "Prices::addFeed: BAD_DECIMALS");

        // Set the feed.
        feeds[_currency] = _feed;

        // Set the decimal adjuster for the currency.
        feedDecimalAdjuster[_currency] = 10**(targetDecimals - _decimals);

        emit AddFeed(_currency, _feed);
    }
}
