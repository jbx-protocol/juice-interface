// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./../interfaces/ITerminalV1.sol";

/** 
  @notice A contract that inherits from JuiceboxProject can use Juicebox as a business-model-as-a-service.
  @dev The owner of the contract makes admin decisions such as:
    - Which address is the funding cycle owner, which can tap funds from the funding cycle.
    - Should this project's Tickets be migrated to a new TerminalV1. 
*/
abstract contract JuiceboxProject is IERC721Receiver, Ownable {
    /// @notice The direct deposit terminals.
    ITerminalDirectory public immutable terminalDirectory;

    /// @notice The ID of the project that should be used to forward this contract's received payments.
    uint256 public projectId;

    /** 
      @param _projectId The ID of the project that should be used to forward this contract's received payments.
      @param _terminalDirectory A directory of a project's current Juicebox terminal to receive payments in.
    */
    constructor(uint256 _projectId, ITerminalDirectory _terminalDirectory) {
        projectId = _projectId;
        terminalDirectory = _terminalDirectory;
    }

    receive() external payable {}

    /** 
      @notice Withdraws funds stored in this contract.
      @param _beneficiary The address to send the funds to.
      @param _amount The amount to send.
    */
    function withdraw(address payable _beneficiary, uint256 _amount)
        external
        onlyOwner
    {
        Address.sendValue(_beneficiary, _amount);
    }

    /** 
      @notice Allows the project that is being managed to be set.
      @param _projectId The ID of the project that is being managed.
    */
    function setProjectId(uint256 _projectId) external onlyOwner {
        projectId = _projectId;
    }

    /** 
      @notice Make a payment to this project.
      @param _beneficiary The address who will receive tickets from this fee.
      @param _memo A memo that will be included in the published event.
      @param _preferUnstakedTickets Whether ERC20's should be claimed automatically if they have been issued.
    */
    function pay(
        address _beneficiary,
        string calldata _memo,
        bool _preferUnstakedTickets
    ) external payable {
        require(projectId != 0, "JuiceboxProject::pay: PROJECT_NOT_FOUND");

        // Get the terminal for this contract's project.
        ITerminal _terminal = terminalDirectory.terminalOf(projectId);

        // There must be a terminal.
        require(
            _terminal != ITerminal(address(0)),
            "JuiceboxProject::pay: TERMINAL_NOT_FOUND"
        );

        _terminal.pay{value: msg.value}(
            projectId,
            _beneficiary,
            _memo,
            _preferUnstakedTickets
        );
    }

    /** 
        @notice Transfer the ownership of the project to a new owner.  
        @dev This contract will no longer be able to reconfigure or tap funds from this project.
        @param _projects The projects contract.
        @param _newOwner The new project owner.
        @param _projectId The ID of the project to transfer ownership of.
        @param _data Arbitrary data to include in the transaction.
    */
    function transferProjectOwnership(
        IProjects _projects,
        address _newOwner,
        uint256 _projectId,
        bytes calldata _data
    ) external onlyOwner {
        _projects.safeTransferFrom(address(this), _newOwner, _projectId, _data);
    }

    /** 
      @notice Allows this contract to receive a project.
    */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function setOperator(
        IOperatorStore _operatorStore,
        address _operator,
        uint256 _projectId,
        uint256[] calldata _permissionIndexes
    ) external onlyOwner {
        _operatorStore.setOperator(_operator, _projectId, _permissionIndexes);
    }

    function setOperators(
        IOperatorStore _operatorStore,
        address[] calldata _operators,
        uint256[] calldata _projectIds,
        uint256[][] calldata _permissionIndexes
    ) external onlyOwner {
        _operatorStore.setOperators(
            _operators,
            _projectIds,
            _permissionIndexes
        );
    }

    /** 
      @notice Take a fee for this project from this contract.
      @param _amount The payment amount.
      @param _beneficiary The address who will receive tickets from this fee.
      @param _memo A memo that will be included in the published event.
      @param _preferUnstakedTickets Whether ERC20's should be claimed automatically if they have been issued.
    */
    function _takeFee(
        uint256 _amount,
        address _beneficiary,
        string memory _memo,
        bool _preferUnstakedTickets
    ) internal {
        require(projectId != 0, "JuiceboxProject::takeFee: PROJECT_NOT_FOUND");
        // Find the terminal for this contract's project.
        ITerminal _terminal = terminalDirectory.terminalOf(projectId);

        // There must be a terminal.
        require(
            _terminal != ITerminal(address(0)),
            "JuiceboxProject::takeFee: TERMINAL_NOT_FOUND"
        );

        // There must be enough funds in the contract to take the fee.
        require(
            address(this).balance >= _amount,
            "JuiceboxProject::takeFee: INSUFFICIENT_FUNDS"
        );

        // Send funds to the terminal.
        _terminal.pay{value: _amount}(
            projectId,
            _beneficiary,
            _memo,
            _preferUnstakedTickets
        );
    }
}
