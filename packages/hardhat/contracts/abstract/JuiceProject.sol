// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./../interfaces/IJuicer.sol";

/** 
  @notice A contract that inherits from JuiceProject can use Juice as a business-model-as-a-service.
  @dev The owner of the contract makes admin decisions such as:
    - Which address is the funding cycle owner, which can tap funds from the funding cycle.
    - Should this project's Tickets be migrated to a new Juicer. 
*/
abstract contract JuiceProject is IERC721Receiver, Ownable {
    ITerminal public terminal;
    uint256 public projectId;

    constructor(ITerminal _terminal, uint256 _projectId) {
        terminal = _terminal;
        projectId = _projectId;
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
      @notice Sets the contract where fees are sent.
      @param _to The new terminal to send fees to.
    */
    function setTerminal(ITerminal _to) external onlyOwner {
        terminal = _to;
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
        require(projectId != 0, "JuiceProject::pay: PROJECT_NOT_FOUND");
        require(
            terminal != ITerminal(address(0)),
            "JuiceProject::pay: TERMINAL_NOT_FOUND"
        );
        terminal.pay{value: msg.value}(
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
        uint256 _projectId,
        address _operator,
        uint256[] calldata _permissionIndexes
    ) external onlyOwner {
        _operatorStore.setOperator(_projectId, _operator, _permissionIndexes);
    }

    function setOperators(
        IOperatorStore _operatorStore,
        uint256[] calldata _projectIds,
        address[] calldata _operators,
        uint256[][] calldata _permissionIndexes
    ) external onlyOwner {
        _operatorStore.setOperators(
            _projectIds,
            _operators,
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
        string calldata _memo,
        bool _preferUnstakedTickets
    ) internal {
        require(projectId != 0, "JuiceProject::takeFee: PROJECT_NOT_FOUND");
        require(
            terminal != ITerminal(address(0)),
            "JuiceProject::takeFee: TERMINAL_NOT_FOUND"
        );
        terminal.pay{value: _amount}(
            projectId,
            _beneficiary,
            _memo,
            _preferUnstakedTickets
        );
    }
}
