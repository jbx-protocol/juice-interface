// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./../interfaces/IJuicer.sol";

import "./../TicketStore.sol";

/** 
  @notice A contract that inherits from JuiceProject can use Juice as a business-model-as-a-service.
  @dev The owner of the contract makes admin decisions such as:
    - Which address is the Budget owner, which can tap funds from the Budget.
    - Should this project's Tickets be migrated to a new Juicer. 
*/
abstract contract JuiceProject is IERC721Receiver, Ownable {
    modifier onlyPm {
        require(msg.sender == pm, "JuiceProject: UNAUTHORIZED");
        _;
    }

    /// @dev The ID of the project that is being managed.
    uint256 public projectId;

    /// @dev The address that can tap funds from the project and propose reconfigurations.
    address public pm;

    /// @dev The juicer that manages this project.
    IJuicer public juicer;

    /** 
      @param _juicer The juicer that manages this project.
      @param _pm The project manager address that can tap funds and propose reconfigurations.
    */
    constructor(IJuicer _juicer, address _pm) {
        juicer = _juicer;
        pm = _pm;
    }

    /** 
      @notice Allows the project that is being managed to be set.
      @param _projectId The ID of the project that is being managed.
    */
    function setProjectId(uint256 _projectId) external {
        // The pm or the owner can set the project.
        require(
            msg.sender == pm || msg.sender == owner(),
            "JuiceProject: UNAUTHORIZED"
        );
        projectId = _projectId;
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
        @return budgetId The ID of the budget that was reconfigured.
    */
    function configure(
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        string memory _name,
        string memory _link,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved
    ) external returns (uint256 budgetId) {
        // The pm or the owner can propose configurations.
        require(
            msg.sender == pm || msg.sender == owner(),
            "JuiceProject: UNAUTHORIZED"
        );

        budgetId = juicer.budgetStore().configure(
            projectId,
            _target,
            _currency,
            _duration,
            _name,
            _link,
            _discountRate,
            _bondingCurveRate,
            _reserved
        );
    }

    /** 
      @notice Redeem tickets that have been transfered to this contract and use the claimed amount to fund this project.
      @param _projectId The ID of the project who's tickets are being redeemed.
      @param _amount The amount of tickets being redeemed.
      @param _minReturnedETH The minimum amount of ETH expected in return.
      @param _note A note to leave on the emitted event.
      @return returnAmount The amount of ETH that was redeemed and used to fund the budget.
    */
    function redeemTicketsAndFund(
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedETH,
        string memory _note
    ) external onlyPm returns (uint256 returnAmount) {
        require(
            projectId != 0,
            "JuiceProject::redeemTicketsAndFund: PROJECT_NOT_FOUND"
        );
        returnAmount = juicer.redeem(
            _projectId,
            _amount,
            _minReturnedETH,
            address(this)
        );

        // Tickets come back to this project.
        juicer.pay(projectId, returnAmount, address(this), _note);
    }

    /** 
      @notice Redeem tickets that have been transfered to this contract.
      @param _projectId The ID of the project who's tickets are being redeemed.
      @param _amount The amount of tickets being redeemed.
      @param _beneficiary The address that is receiving the redeemed tokens.
      @param _minReturnedETH The minimum amount of ETH expected in return.
      @return _returnAmount The amount of ETH that was redeemed.
    */
    function redeemTickets(
        uint256 _projectId,
        uint256 _amount,
        address _beneficiary,
        uint256 _minReturnedETH
    ) external onlyPm returns (uint256 _returnAmount) {
        _returnAmount = juicer.redeem(
            _projectId,
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
            projectId,
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
        juicer.projects().safeTransferFrom(address(this), _newOwner, projectId);
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
        require(projectId != 0, "JuiceProject::migrate: PROJECT_NOT_FOUND");

        // Migrate.
        _from.migrate(projectId, _to);

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
        require(projectId != 0, "JuiceProject::takeFee: PROJECT_NOT_FOUND");
        juicer.pay(projectId, _amount, _from, _note);
    }

    /** 
      @notice Allows this contract to receive a project.
    */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
