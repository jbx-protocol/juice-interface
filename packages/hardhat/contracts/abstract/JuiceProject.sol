// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

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
    modifier onlyPm {
        require(msg.sender == pm, "JuiceProject: UNAUTHORIZED");
        _;
    }

    /// @dev The name of this Budget owner's tickets.
    string public ticketName;

    /// @dev The symbol of this Budget owner's tickets.
    string public ticketSymbol;

    /// @dev The project that is being managed.
    bytes32 public project;

    /// @dev The address that can tap funds from the project and propose reconfigurations.
    address public pm;

    /// @dev The juicer that manages this project.
    IJuicer public juicer;

    /** 
      @param _juicer The juicer that manages this project.
      @param _ticketName The name for this project's ERC-20 Tickets.
      @param _ticketSymbol The symbol for this project's ERC-20 Tickets.
      @param _pm The project manager address that can tap funds and propose reconfigurations.
    */
    constructor(
        IJuicer _juicer,
        string memory _ticketName,
        string memory _ticketSymbol,
        address _pm
    ) {
        juicer = _juicer;
        ticketName = _ticketName;
        ticketSymbol = _ticketSymbol;
        pm = _pm;
    }

    /** 
        @notice Issues this project's Tickets. 
    */
    function issueTickets() external onlyOwner {
        require(project != 0, "JuiceProject::issueTickets: PROJECT_NOT_FOUND");
        juicer.ticketStore().issue(project, ticketName, ticketSymbol);
    }

    /** 
      @notice Allows the project that is being managed to be set.
      @param _project the project that is being managed.
    */
    function setProject(bytes32 _project) external {
        // The pm or the owner can set the project.
        require(
            msg.sender == pm || msg.sender == owner(),
            "JuiceProject: UNAUTHORIZED"
        );
        project = _project;
    }

    /**
        @notice This is how the Budget is configured, and reconfiguration over time.
        @param _target The new Budget target amount.
        @param _currency The currency of the target.
        @param _duration The new duration of your Budget.
        @param _name A name for the Budget.
        @param _link A link to information about the Budget.
        @param _discountRate A number from 70-130 indicating how valuable a Budget is compared to the owners previous Budget,
        effectively creating a recency discountRate.
        If it's 100, each Budget will have equal weight.
        If the number is 130, each Budget will be treated as 1.3 times as valuable than the previous, meaning sustainers get twice as much redistribution shares.
        If it's 0.7, each Budget will be 0.7 times as valuable as the previous Budget's weight.
        @param _reserved The percentage of this Budget's surplus to allocate to the owner.
        @return _project The ID of the project that was reconfigured.
    */
    function configure(
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string calldata _name,
        string calldata _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved
    ) external returns (bytes32 _project) {
        // The pm or the owner can propose configurations.
        require(
            msg.sender == pm || msg.sender == owner(),
            "JuiceProject: UNAUTHORIZED"
        );
        _project = juicer.budgetStore().configure(
            project,
            _target,
            _currency,
            _duration,
            _name,
            _link,
            _discountRate,
            _bondingCurveRate,
            _reserved
        );

        if (project == 0) project = _project;
    }

    /** 
      @notice Redeem tickets that have been transfered to this contract and use the claimed amount to fund this project.
      @param _project The project who's tickets are being redeemed.
      @param _amount The amount of tickets being redeemed.
      @param _minReturnedETH The minimum amount of ETH expected in return.
      @param _note A note to leave on the emitted event.
      @return returnAmount The amount of ETH that was redeemed and used to fund the budget.
    */
    function redeemTicketsAndFund(
        bytes32 _project,
        uint256 _amount,
        uint256 _minReturnedETH,
        string memory _note
    ) external onlyPm returns (uint256 returnAmount) {
        require(
            project != 0,
            "JuiceProject::redeemTicketsAndFund: PROJECT_NOT_FOUND"
        );
        returnAmount = juicer.redeem(
            _project,
            _amount,
            _minReturnedETH,
            address(this)
        );

        // Tickets come back to this project.
        juicer.pay(project, returnAmount, address(this), _note);
    }

    /** 
      @notice Redeem tickets that have been transfered to this contract.
      @param _project The project who's tickets are being redeemed.
      @param _amount The amount of tickets being redeemed.
      @param _beneficiary The address that is receiving the redeemed tokens.
      @param _minReturnedETH The minimum amount of ETH expected in return.
      @return _returnAmount The amount of ETH that was redeemed.
    */
    function redeemTickets(
        bytes32 _project,
        uint256 _amount,
        address _beneficiary,
        uint256 _minReturnedETH
    ) external onlyPm returns (uint256 _returnAmount) {
        _returnAmount = juicer.redeem(
            _project,
            _amount,
            _minReturnedETH,
            _beneficiary
        );
    }

    /** 
      @notice Taps the funds available.
      @param _budgetId The ID of the Budget to tap.
      @param _amount The amount to tap.
      @param _currency The currency to tap.
      @param _beneficiary The address to transfer the funds to.
      @param _minReturnedETH The minimum number of Eth that the amount should be valued at.
    */
    function tap(
        uint256 _budgetId,
        uint256 _amount,
        uint256 _currency,
        address _beneficiary,
        uint256 _minReturnedETH
    ) external onlyPm {
        juicer.tap(
            _budgetId,
            _amount,
            _currency,
            _beneficiary,
            _minReturnedETH
        );
    }

    /** 
        @notice Sets the address that can tap the Budget. 
        @param _pm The new project manager.
    */
    function setPm(address _pm) external onlyOwner {
        pm = _pm;
    }

    /** 
        @notice Transfer the ownership of the project to a new owner.  
        @dev This contract will no longer be able to reconfigure or tap funds from this project.
        @param _newOwner The new project owner.
    */
    function transferProjectOwnership(address _newOwner) external onlyOwner {
        juicer.budgetStore().transferProjectOwnership(project, _newOwner);
    }

    /** 
      @notice Migrates the ability to mint and redeem this contract's Tickets to a new Juicer.
      @dev The destination must be in the current Juicer's allow list.
      @param _from The contract that currently manages your Tickets and it's funds.
      @param _to The new contract that will manage your Tickets and it's funds.
    */
    function migrate(IJuicer _from, IJuicer _to) public onlyOwner {
        require(_to != IJuicer(0), "JuiceProject::migrate: ZERO_ADDRESS");
        require(_from == juicer, "JuiceProject::migrate: INVALID");
        require(project != 0, "JuiceProject::migrate: PROJECT_NOT_FOUND");

        // Migrate.
        _from.migrate(project, _to);

        // Set the new juicer.
        juicer = _to;
    }

    /** 
      @notice Take a fee for this project.
      @param _amount The amount of the fee.
      @param _from The address who will receive tickets from this fee.
      @param _note A note that will be included in the published event.
    */
    function takeFee(
        uint256 _amount,
        address _from,
        string memory _note
    ) internal {
        require(project != 0, "JuiceProject::takeFee: PROJECT_NOT_FOUND");
        juicer.pay(project, _amount, _from, _note);
    }
}
