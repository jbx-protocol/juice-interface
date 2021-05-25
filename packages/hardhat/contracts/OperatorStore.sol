// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IOperatorStore.sol";

contract OperatorStore is IOperatorStore {
    /// @notice A permissions mapping for the addresses that are designated operators of each account.
    mapping(address => mapping(uint256 => mapping(address => uint256)))
        public
        override permissions;

    constructor() {}

    /** 
      @notice Whether or not an operator has the permission to take a certain action pertaining to the specified account's project.
      @param _account The account that has given out permission to the operator.
      @param _projectId The ID of the project that the operator has been given permissions to operate.
      @param _operator The operator to check.
      @param _permissionIndex the permission to check for.
    */
    function hasPermission(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256 _permissionIndex
    ) external view override returns (bool) {
        require(
            _permissionIndex <= 255,
            "OperatorStore::hasPermissions: BAD_INDEX"
        );
        return
            ((permissions[_account][_projectId][_operator] >>
                _permissionIndex) & uint256(1)) == 1;
    }

    /** 
      @notice Whether or not an operator has the permission to take a certain action pertaining to the specified account's project.
      @param _account The account that has given out permission to the operator.
      @param _projectId The ID of the project that the operator has been given permissions to operate.
      @param _operator The operator to check.
      @param _indexes An array of indexes of permissions to check for.
    */
    function hasPermissions(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] memory _indexes
    ) external view override returns (bool) {
        for (uint256 _i = 0; _i < _indexes.length; _i++) {
            uint256 _permissionIndex = _indexes[_i];

            require(
                _permissionIndex <= 255,
                "OperatorStore::hasPermissions: BAD_INDEX"
            );

            if (
                ((permissions[_account][_projectId][_operator] >>
                    _permissionIndex) & uint256(1)) == 0
            ) return false;
        }
        return true;
    }

    /** 
      @notice Allows accounts to set operators of their accounts by setting the packed permissions value directly.
      @param _projectId The ID of the project that the operator is being given permissions to operate.
      @param _operator The operator to give permission to.
      @param _value The packed permissions.
    */
    function setPackedPermissions(
        uint256 _projectId,
        address _operator,
        uint256 _value
    ) external override {
        _setPackedPermissions(msg.sender, _projectId, _operator, _value);
    }

    /** 
      @notice Allows the specified operator tap funds and redeem tickets on the msg.sender's behalf.
      @param _projectId The ID of the project that the operator is being given permissions to operate.
      @param _operator The operator to give permission to.
      @param _indexes An array of indexes of permissions to allow.
    */
    function addPermissionsToOperator(
        uint256 _projectId,
        address _operator,
        uint256[] memory _indexes
    ) external override {
        _setPackedPermissions(
            msg.sender,
            _projectId,
            _operator,
            _packedPermissions(
                permissions[msg.sender][_projectId][_operator],
                _indexes,
                true
            )
        );
        emit AddPermissionsToOperator(
            msg.sender,
            _projectId,
            _operator,
            _indexes
        );
    }

    /** 
      @notice Allows the specified operators tap funds and redeem tickets on the msg.sender's behalf.
      @param _projectIds The IDs of the projects that can be operated. Set to 0 to allow operation of account level actions.
      @param _operators The operators to give permission to.
      @param _indexes The level of power each operator should have.
    */
    function addPermissionsToOperators(
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[][] memory _indexes
    ) external override {
        // There should be a level for each operator provided.
        require(
            _operators.length == _indexes.length &&
                _operators.length == _projectIds.length,
            "OperatorStore::addPermissionsToOperators: BAD_ARGS"
        );
        for (uint256 _i = 0; _i < _operators.length; _i++)
            _setPackedPermissions(
                msg.sender,
                _projectIds[_i],
                _operators[_i],
                _packedPermissions(
                    permissions[msg.sender][_projectIds[_i]][_operators[_i]],
                    _indexes[_i],
                    true
                )
            );

        emit AddPermissionsToOperators(
            msg.sender,
            _projectIds,
            _operators,
            _indexes
        );
    }

    /** 
      @notice Revokes the ability for the specified operator to tap funds and redeem tickets on the msg.sender's behalf.
      @param _account The address to remove an operator from.
      @param _projectId The ID of the project that can no longer be operated.
      @param _operator The operator to remove permission from.
      @param _indexes The permissions to remove.
    */
    function removePermissionsFromOperator(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] memory _indexes
    ) external override {
        // Only an account or a specified operator can remove an operator. A specified operator can only remove themselves.
        require(
            msg.sender == _account ||
                (_operator == msg.sender &&
                    permissions[_account][_projectId][msg.sender] > 0),
            "Juicer::removePermissionsFromOperator: UNAUTHORIZED"
        );

        // Set the operator to level 0.
        _setPackedPermissions(
            _account,
            _projectId,
            _operator,
            _packedPermissions(
                permissions[_account][_projectId][_operator],
                _indexes,
                false
            )
        );

        emit RemovePermissionsFromOperator(
            _account,
            _projectId,
            _operator,
            msg.sender
        );
    }

    /** 
      @notice Revokes the ability for the specified operators to tap funds and redeem tickets on the msg.sender's behalf.
      @param _account The address to remove an operators from.
      @param _projectIds The IDs of the projects that can no longer be operated.
      @param _operators The operator to remove permission from.
      @param _indexes The permissions to remove from each operator.
    */
    function removePermissionsFromOperators(
        address _account,
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[][] memory _indexes
    ) external override {
        // There should be a projectId for each operator provided.
        require(
            _operators.length == _projectIds.length &&
                _operators.length == _indexes.length,
            "OperatorStore::removePermissionsFromOperators: BAD_ARGS"
        );

        // Set the operator to level 0.
        for (uint256 _i = 0; _i < _operators.length; _i++) {
            // Only an account or a specified operator can remove an operator. A specified operator can only remove themselves
            if (_account != msg.sender) {
                require(
                    msg.sender == _operators[_i] &&
                        (permissions[_account][_projectIds[_i]][msg.sender] >
                            0),
                    "Juicer::removePermissionsFromOperators: UNAUTHORIZED"
                );
            }
            _setPackedPermissions(
                _account,
                _projectIds[_i],
                _operators[_i],
                _packedPermissions(
                    permissions[_account][_projectIds[_i]][_operators[_i]],
                    _indexes[_i],
                    false
                )
            );
        }

        emit RemovePermissionsFromOperators(
            _account,
            _projectIds,
            _operators,
            msg.sender
        );
    }

    /** 
      @notice Allows accounts to set operators of their accounts by setting the packed permissions value directly.
      @param _account The account that is being operated.
      @param _projectId The ID of the project that the operator is being given permissions to operate.
      @param _operator The operator to give permission to.
      @param _value The packed permissions.
    */
    function _setPackedPermissions(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256 _value
    ) private {
        permissions[_account][_projectId][_operator] = _value;
        emit SetPackedPermissions(
            _account,
            _projectId,
            _operator,
            _value,
            msg.sender
        );
    }

    /** 
    @notice Converts an array of permission indexes to a packed int.
    @param _base The base packed int to start with.
    @param _indexes The indexes of the permissions to pack.
    @param _flag Whether the permissions should be flipped true or false.
    */
    function _packedPermissions(
        uint256 _base,
        uint256[] memory _indexes,
        bool _flag
    ) private pure returns (uint256) {
        // Zero out the value;
        uint256 _packed = 0;
        for (uint256 _i = 0; _i < _indexes.length; _i++) {
            uint256 _permissionIndex = _indexes[_i];
            require(
                _permissionIndex <= 255,
                "OperatorStore::_packedPermissions: BAD_INDEX"
            );
            // Turn the bit at the index on.
            _packed |= uint256(1) << _permissionIndex;
        }

        return _flag ? _packed | _base : ~_packed & _base;
    }
}
