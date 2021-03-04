// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

import "./interfaces/IAccessControlWrapper.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IBudgetBallot.sol";
import "./abstract/JuiceProject.sol";

/// All functions in here should be governable with FLOW.
/// Owner should eventually change to a governance contract.
contract Admin is JuiceProject {
    using SafeERC20 for IERC20;

    constructor(
        string memory _ticketName,
        string memory _ticketSymbol,
        address _pm
    ) public JuiceProject(_ticketName, _ticketSymbol, _pm) {}

    /** 
      @notice Grants the admin role for a contract that this Admin contract controls.
      @param _contract The contract that is being given access to.
      @param _newAdmin The address that is being given the admin role.
    */
    function grantAdmin(IAccessControlWrapper _contract, address _newAdmin)
        external
        onlyOwner
    {
        _contract.grantRole_(_contract.DEFAULT_ADMIN_ROLE_(), _newAdmin);
    }

    /** 
      @notice Revokes the admin role for a contract that this Admin contract controls.
      @param _contract The contract that is having access to revoked.
      @param _newAdmin The address that is having the admin role revoked.
    */
    function revokeAdmin(IAccessControlWrapper _contract, address _newAdmin)
        external
        onlyOwner
    {
        _contract.revokeRole_(_contract.DEFAULT_ADMIN_ROLE_(), _newAdmin);
    }

    /** 
      @notice Revokes the ability for a Juicer to access its Ticket store and Budget stores
      @param _juicer The juicer that is being depcrecated.
    */
    function deprecateJuicer(IJuicer _juicer) external onlyOwner {
        IBudgetStore _budgetStore = _juicer.budgetStore();
        ITicketStore _ticketStore = _juicer.ticketStore();
        _ticketStore.revokeRole_(
            _ticketStore.DEFAULT_ADMIN_ROLE_(),
            address(_juicer)
        );
        _budgetStore.revokeRole_(
            _budgetStore.DEFAULT_ADMIN_ROLE_(),
            address(_juicer)
        );
    }

    /** 
      @notice Gives Ticket holders within one Juicer access to migrate to another Juicer.
      @param _from The juicer to allow a new migration from.
      @param _to The juicer to allow migration to.
    */
    function allowMigration(IJuicer _from, address _to) external onlyOwner {
        _from.allowMigration(address(_to));
    }

    /** 
      @notice Sets a new contract that will yield returns on the juicer's overflow.
      @param _juicer The juicer to change the recalibration target of.
      @param _overflowYielder The new overflow yielder.
    */
    function setOverflowYielder(
        IJuicer _juicer,
        IOverflowYielder _overflowYielder
    ) external onlyOwner {
        _juicer.setOverflowYielder(_overflowYielder);
    }

    /**
        @notice Set the bonding curve rate for the juicer.
        @param _juicer The juicer to change the bonding curve of.
        @param _rate The new rate.
    */
    function setBondingCurveRate(IJuicer _juicer, uint256 _rate)
        external
        onlyOwner
    {
        _juicer.setBondingCurveRate(_rate);
    }

    /**
        @notice Adds a price feed to a budget store.
        @param _budgetStore The budget store to add a price feed to.
        @param _priceFeed The price feed to add.
        @param _currency The currency the price feed is for.
    */
    function addPriceFeed(
        IBudgetStore _budgetStore,
        AggregatorV3Interface _priceFeed,
        uint256 _currency
    ) external onlyOwner {
        _budgetStore.addPriceFeed(_priceFeed, _currency);
    }
}
