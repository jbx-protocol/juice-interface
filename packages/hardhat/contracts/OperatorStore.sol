// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IOperatorStore.sol";

contract OperatorStore is IOperatorStore {
    /// @notice A mapping of the addresses that are designated operators of each account.
    mapping(address => mapping(uint256 => mapping(address => uint256)))
        public
        override operatorLevel;

    constructor() public {}

    /** 
      @notice Allows the specified operator tap funds and redeem tickets on the msg.sender's behalf.
      @param _operator The operator to give permission to.
    */
    function addOperator(
        uint256 _projectId,
        address _operator,
        uint256 _level
    ) external override {
        operatorLevel[msg.sender][_projectId][_operator] = _level;
        emit AddOperator(msg.sender, _projectId, _operator, _level);
    }

    /** 
      @notice Revokes the ability for the specified operator to tap funds and redeem tickets on the msg.sender's behalf.
      @param _operator The operator to give permission to.
    */
    function removeOperator(
        address _account,
        uint256 _projectId,
        address _operator
    ) external override {
        // Revoke the msg.sender if there's no operator.
        if (_operator == address(0)) _operator = msg.sender;

        // Only an account or a specified operator can remove an operator. A specified operator can only remove themselves
        require(
            msg.sender == _account ||
                (operatorLevel[_account][_projectId][msg.sender] > 0 &&
                    _operator == msg.sender),
            "Juicer::removeOperator: UNAUTHORIZED"
        );

        // Set the operator to level 0.
        operatorLevel[_account][_projectId][_operator] = 0;

        emit RemoveOperator(_account, _projectId, msg.sender, _operator);
    }
}
