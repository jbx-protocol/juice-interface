// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/ITerminal.sol";
import "./interfaces/IPrices.sol";
import "./abstract/JuiceProject.sol";

/// Owner should eventually change to a multisig wallet contract.
contract Governance is JuiceProject {
    // --- external transactions --- //

    constructor(uint256 _projectId)
        JuiceProject(ITerminal(address(0)), _projectId)
    {}

    /** 
      @notice Gives projects using one Juicer access to migrate to another Juicer.
      @param _from The terminal to allow a new migration from.
      @param _to The terminal to allow migration to.
    */
    function allowMigration(ITerminal _from, ITerminal _to) external onlyOwner {
        _from.allowMigration(_to);
    }

    /**
        @notice Adds a price feed.
        @param _prices The prices contract to add a feed to.
        @param _feed The price feed to add.
        @param _currency The currency the price feed is for.
    */
    function addPriceFeed(
        IPrices _prices,
        AggregatorV3Interface _feed,
        uint256 _currency
    ) external onlyOwner {
        _prices.addFeed(_feed, _currency);
    }

    /** 
      @notice Sets a new contract that will yield returns on the juicer's funds.
      @param _juicer The juicer to change the yielder of.
      @param _yielder The new yielder.
    */
    function setYielder(IJuicer _juicer, IYielder _yielder) external onlyOwner {
        _juicer.setYielder(_yielder);
    }

    /** 
      @notice Sets the target amount of ETH to keep in the Juicer's contract instead of depositing.
      @param _juicer The juicer to change the target local ETH of.
      @param _amount The new target.
    */
    function setTargetLocalETH(IJuicer _juicer, uint256 _amount)
        external
        onlyOwner
    {
        _juicer.setTargetLocalETH(_amount);
    }

    /** 
      @notice Sets the fee of the Juicer.
      @param _juicer The juicer to change the fee of.
      @param _fee The new fee.
    */
    function setFee(IJuicer _juicer, uint256 _fee) external onlyOwner {
        _juicer.setFee(_fee);
    }

    /** 
      @notice Sets the fee of the Juicer.
      @param _juicer The juicer to change the governance of.
      @param _newGovernance The address to appoint as governance.
    */
    function appointGovernance(IJuicer _juicer, address payable _newGovernance)
        external
        onlyOwner
    {
        _juicer.appointGovernance(_newGovernance);
    }
}
