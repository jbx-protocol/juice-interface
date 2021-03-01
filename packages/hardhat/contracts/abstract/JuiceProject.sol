// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./../interfaces/IJuicer.sol";

import "./../TicketStore.sol";

/** 
  @notice A contract that inherits from JuiceProject can use Juice as a business-model-as-a-service.
  @dev The owner of the contract makes admin decisions such as:
    - Which address is the Budget owner, which can tap funds from the Budget.
    - Should this project's Tickets be migrated to a new Juicer. 
*/
abstract contract JuiceProject is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    modifier onlyPm {
        require(msg.sender == pm, "JuiceProject: UNAUTHORIZED");
        _;
    }

    /// @dev The name of this Budget owner's tickets.
    string public ticketName;

    /// @dev The symbol of this Budget owner's tickets.
    string public ticketSymbol;

    /// @dev The address that can tap funds from the project and propose reconfigurations.
    address public pm;

    /** 
      @param _ticketName The name for this project's ERC-20 Tickets.
      @param _ticketSymbol The symbol for this project's ERC-20 Tickets.
      @param _pm The project manager address that can tap funds and propose reconfigurations.
    */
    constructor(
        string memory _ticketName,
        string memory _ticketSymbol,
        address _pm
    ) internal {
        ticketName = _ticketName;
        ticketSymbol = _ticketSymbol;
        pm = _pm;
    }

    /** 
        @notice Issues this project's Tickets. 
        @param _store The ticket store to issue in.
    */
    function issueTickets(ITicketStore _store) external onlyOwner {
        _store.issue(bytes(ticketName), bytes(ticketSymbol));
    }

    /**
        @notice This is how the Budget is configured, and reconfiguration over time.
        @param _store The budget store to configure in.
        @param _target The new Budget target amount.
        @param _duration The new duration of your Budget.
        @param _name A name for the Budget.
        @param _link A link to information about the Budget.
        @param _discountRate A number from 70-130 indicating how valuable a Budget is compared to the owners previous Budget,
        effectively creating a recency discountRate.
        If it's 100, each Budget will have equal weight.
        If the number is 130, each Budget will be treated as 1.3 times as valuable than the previous, meaning sustainers get twice as much redistribution shares.
        If it's 0.7, each Budget will be 0.7 times as valuable as the previous Budget's weight.
        @param _p The percentage of this Budget's surplus to allocate to the owner.
        @param _b The percentage of this Budget's surplus to allocate towards a beneficiary address. This can be another contract, or an end user address.
        An example would be a contract that allocates towards a specific purpose, such as Gitcoin grant matching.
        @param _bAddress The address of the beneficiary contract where a specified percentage is allocated.
        @return _budgetId The ID of the Budget that was reconfigured.
    */
    function configure(
        IBudgetStore _store,
        uint256 _target,
        uint256 _duration,
        string calldata _name,
        string calldata _link,
        uint256 _discountRate,
        uint256 _p,
        uint256 _b,
        address _bAddress
    ) external returns (uint256) {
        // The pm or the owner can propose configurations.
        require(
            msg.sender == pm || msg.sender == owner(),
            "JuiceProject: UNAUTHORIZED"
        );
        return
            _store.configure(
                _target,
                _duration,
                _name,
                _link,
                _discountRate,
                _p,
                _b,
                _bAddress
            );
    }

    /** 
      @notice Redeem tickets that have been transfered to this contract and use the claimed amount to fund this project.
      @param _juicer The Juicer to redeem from.
      @param _issuer The issuer who's tickets are being redeemed.
      @param _amount The amount of tickets being redeemed.
      @param _minReturn The minimum amount of tokens expected in return.
    */
    function redeemTicketsAndFund(
        IJuicer _juicer,
        address _issuer,
        uint256 _amount,
        uint256 _minReturn
    ) external onlyPm {
        uint256 _returnAmount =
            _juicer.redeem(_issuer, _amount, _minReturn, address(this));

        // Surplus goes back to the issuer.
        _juicer.pay(address(this), _returnAmount, _issuer);
    }

    /** 
      @notice Taps the funds available.
      @param _budgetId The ID of the Budget to tap.
      @param _amount The amount to tap.
      @param _beneficiary The address to transfer the funds to.
    */
    function tap(
        IJuicer _juicer,
        uint256 _budgetId,
        uint256 _amount,
        address _beneficiary
    ) external onlyPm {
        _juicer.tap(_budgetId, _amount, _beneficiary);
    }

    /** 
        @notice Sets the address that can tap the Budget. 
        @param _pm The new project manager.
    */
    function setPm(address _pm) external onlyOwner {
        pm = _pm;
    }

    /** 
      @notice Migrates the ability to mint and redeem this contract's Tickets to a new Juicer.
      @dev The destination must be in the current Juicer's allow list.
      @param _from The contract that currently manages your Tickets and it's funds.
      @param _to The new contract that will manage your Tickets and it's funds.
    */
    function migrate(IJuicer _from, IJuicer _to) public onlyOwner {
        require(_to != IJuicer(0), "JuiceProject::setJuicer: ZERO_ADDRESS");
        _from.migrate(_to);
    }

    /** 
      @notice Take a fee for this project.
      @param _juicer The juicer used to process the fee.
      @param _amount The amount of the fee.
      @param _from The address who will receive tickets from this fee.
    */
    function takeFee(
        IJuicer _juicer,
        uint256 _amount,
        address _from
    ) internal {
        _juicer.pay(address(this), _amount, _from);
    }
}
