// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IPrices.sol";

/** 
  @notice An immutable contract to manage Budget states.
*/
contract Prices is IPrices, AccessControl {
    modifier onlyAdmin {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Store: UNAUTHORIZED");
        _;
    }

    /// @notice The available price feeds that can be used to get the price of ETH.
    mapping(uint256 => AggregatorV3Interface) public override feeds;

    /** 
      @notice Gets the current price of ETH for the provided currency.
      @param _currency The currency to get a price for.
      @return price The price of ETH.
    */
    function getETHPrice(uint256 _currency)
        external
        view
        override
        returns (uint256)
    {
        // The 0 currency is ETH itself.
        if (_currency == 0) return 1;
        AggregatorV3Interface _feed = feeds[_currency];
        //TODO temp
        if (_feed == AggregatorV3Interface(0)) return 1600E18;
        // require(
        //     _priceFeed != AggregatorV3Interface(0),
        //     "BudgetStore::getETHPrice NOT_FOUND"
        // );
        (, int256 _price, , , ) = _feed.latestRoundData();
        return uint256(_price);
    }

    /** 
      @notice Add a price feed for the price of ETH.
      @param _feed The price feed being added.
      @param _currency The currency that the price feed is for.
    */
    function addFeed(AggregatorV3Interface _feed, uint256 _currency)
        external
        override
        onlyAdmin
    {
        feeds[_currency] = _feed;

        emit AddFeed(_currency, _feed);
    }
}
