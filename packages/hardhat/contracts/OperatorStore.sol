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
      @notice Allows the specified operators tap funds and redeem tickets on the msg.sender's behalf.
      @param _projectIds The IDs of the projects that can be operated. Set to 0 to allow operation of account level actions.
      @param _operators The operators to give permission to.
      @param _levels The level of power each operator should have.
    */
    function addOperators(
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[] memory _levels
    ) external override {
        // There should be a level for each operator provided.
        require(
            _operators.length == _levels.length &&
                _operators.length == _projectIds.length,
            "OperatorStore::addOperators: BAD_ARGS"
        );
        for (uint256 _i = 0; _i < _operators.length; _i++)
            operatorLevel[msg.sender][_projectIds[_i]][
                _operators[_i]
            ] = _levels[_i];
        emit AddOperators(msg.sender, _projectIds, _operators, _levels);
    }

    /** 
      @notice Revokes the ability for the specified operator to tap funds and redeem tickets on the msg.sender's behalf.
      @param _account The address to remove an operator from.
      @param _projectId The ID of the project that can no longer be operated.
      @param _operator The operator to remove permission from.
    */
    function removeOperator(
        address _account,
        uint256 _projectId,
        address _operator
    ) external override {
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

    /** 
      @notice Revokes the ability for the specified operators to tap funds and redeem tickets on the msg.sender's behalf.
      @param _account The address to remove an operators from.
      @param _projectIds The IDs of the projects that can no longer be operated.
      @param _operators The operator to remove permission from.
    */
    function removeOperators(
        address _account,
        uint256[] memory _projectIds,
        address[] memory _operators
    ) external override {
        // Only an account or a specified operator can remove operators.
        require(msg.sender == _account, "Juicer::removeOperator: UNAUTHORIZED");

        // There should be a projectId for each operator provided.
        require(
            _operators.length == _projectIds.length,
            "OperatorStore::removeOperators: BAD_ARGS"
        );

        // Set the operator to level 0.
        for (uint256 _i = 0; _i < _operators.length; _i++)
            operatorLevel[_account][_projectIds[_i]][_operators[_i]] = 0;

        emit RemoveOperators(_account, _projectIds, msg.sender, _operators);
    }
}
