// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./../interfaces/IJuicer.sol";

/** 
  @notice A contract that inherits from JuiceProject can use Juice as a business-model-as-a-service.
  @dev The owner of the contract makes admin decisions such as:
    - Which address is the funding cycle owner, which can tap funds from the funding cycle.
    - Should this project's Tickets be migrated to a new Juicer. 
*/
abstract contract JuiceProject is IERC721Receiver, Ownable {
    using SafeMath for uint256;

    IJuiceTerminal public juiceTerminal;
    uint256 public projectId;

    constructor(IJuiceTerminal _juiceTerminal) {
        juiceTerminal = _juiceTerminal;
    }

    receive() external payable {}

    function switchJuiceTerminal(IJuiceTerminal _to) external onlyOwner {
        juiceTerminal = _to;
    }

    /** 
      @notice Allows the project that is being managed to be set.
      @param _projectId The ID of the project that is being managed.
    */
    function setProjectId(uint256 _projectId) external onlyOwner {
        projectId = _projectId;
    }

    /** 
        @notice Transfer the ownership of the project to a new owner.  
        @dev This contract will no longer be able to reconfigure or tap funds from this project.
        @param _projects The projects contract.
        @param _newOwner The new project owner.
        @param _projectId The ID of the project to transfer ownership of.
    */
    function transferProjectOwnership(
        IProjects _projects,
        address _newOwner,
        uint256 _projectId
    ) external onlyOwner {
        _projects.safeTransferFrom(address(this), _newOwner, _projectId);
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

    function addMod(
        IModStore _modStore,
        address payable _beneficiary,
        uint256 _percent
    ) external onlyOwner {
        _modStore.addMod(projectId, _beneficiary, _percent);
    }

    function removeMod(IModStore _modStore, uint256 _id) external onlyOwner {
        _modStore.removeMod(projectId, _id);
    }

    function addOperator(
        IOperatorStore _operatorStore,
        address _operator,
        uint256 _level
    ) external onlyOwner {
        _operatorStore.addOperator(projectId, _operator, _level);
    }

    function removeOperator(
        IOperatorStore _operatorStore,
        address _account,
        address _operator
    ) external onlyOwner {
        _operatorStore.removeOperator(_account, projectId, _operator);
    }
}
