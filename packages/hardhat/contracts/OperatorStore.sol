// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IOperatorStore.sol";

contract OperatorStore is IOperatorStore {
    /// @notice A mapping of the addresses that are designated operators of each account.
    mapping(address => mapping(uint256 => mapping(address => uint256)))
        public
        override operatorPermissions;

    constructor() public {}

    /** 
      @notice Whether or not an operator has the permission to take a certain action pertaining to the specified account's project.
      @param _account The account that has given out permission to the operator.
      @param _projectId The ID of the project that the operator has been given permissions to operate.
      @param _operator The operator to check.
      @param _permissionIndex the permissions to check.
    */
    function hasPermission(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256 _permissionIndex
    ) external override returns (bool) {
        require(
            _permissionIndex <= 255,
            "OperatorStore::hasPermissions: BAD_INDEX"
        );
        return
            ((operatorPermissions[_account][_projectId][_operator] >>
                _permissionIndex) & uint256(1)) == 1;
    }

    /** 
      @notice Whether or not an operator has the permission to take a certain action pertaining to the specified account's project.
      @param _account The account that has given out permission to the operator.
      @param _projectId The ID of the project that the operator has been given permissions to operate.
      @param _operator The operator to check.
      @param _permissionIndexes An array of indexes of permissions to check.
    */
    function hasPermissions(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] memory _permissionIndexes
    ) external override returns (bool) {
        for (uint256 _i = 0; _i < _permissionIndexes.length; _i++) {
            uint256 _permissionIndex = _permissionIndexes[_i];

            require(
                _permissionIndex <= 255,
                "OperatorStore::hasPermissions: BAD_INDEX"
            );

            if (
                ((operatorPermissions[_account][_projectId][_operator] >>
                    _permissionIndex) & uint256(1)) == 0
            ) return false;
        }
        return true;
    }

    /** 
      @notice Allows the specified operator tap funds and redeem tickets on the msg.sender's behalf.
      @param _projectId The ID of the project that the operator is being given permissions to operate.
      @param _operator The operator to give permission to.
      @param _permissionIndexes An array of indexes of permissions to allow.
    */
    function addOperator(
        uint256 _projectId,
        address _operator,
        uint256[] memory _permissionIndexes
    ) external override {
        uint256 _packedPermissions = _packedPermissions(_permissionIndexes);
        operatorPermissions[msg.sender][_projectId][
            _operator
        ] = _packedPermissions;
        emit AddOperator(msg.sender, _projectId, _operator, _permissionIndexes);
    }

    /** 
      @notice Allows the specified operators tap funds and redeem tickets on the msg.sender's behalf.
      @param _projectIds The IDs of the projects that can be operated. Set to 0 to allow operation of account level actions.
      @param _operators The operators to give permission to.
      @param _permissionIndexes The level of power each operator should have.
    */
    function addOperators(
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[][] memory _permissionIndexes
    ) external override {
        // There should be a level for each operator provided.
        require(
            _operators.length == _permissionIndexes.length &&
                _operators.length == _projectIds.length,
            "OperatorStore::addOperators: BAD_ARGS"
        );
        for (uint256 _i = 0; _i < _operators.length; _i++)
            operatorPermissions[msg.sender][_projectIds[_i]][
                _operators[_i]
            ] = _packedPermissions(_permissionIndexes[_i]);
        emit AddOperators(
            msg.sender,
            _projectIds,
            _operators,
            _permissionIndexes
        );
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
                (operatorPermissions[_account][_projectId][msg.sender] > 0 &&
                    _operator == msg.sender),
            "Juicer::removeOperator: UNAUTHORIZED"
        );

        // Set the operator to level 0.
        operatorPermissions[_account][_projectId][_operator] = 0;

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
            operatorPermissions[_account][_projectIds[_i]][_operators[_i]] = 0;

        emit RemoveOperators(_account, _projectIds, msg.sender, _operators);
    }

    function _packedPermissions(uint256[] memory _permissionIndexes)
        private
        returns (uint256 packed)
    {
        // Zero out the value;
        packed = uint256(0);
        for (uint256 _i = 0; _i < _permissionIndexes.length; _i++) {
            uint256 _permissionIndex = _permissionIndexes[_i];
            require(
                _permissionIndex <= 255,
                "OperatorStore::_packedPermissions: BAD_INDEX"
            );
            // Turn the bit at the index on.
            packed |= uint256(1) << _permissionIndex;
        }
    }
}
