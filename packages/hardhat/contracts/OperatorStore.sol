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
      @param _permissionIndexes An array of indexes of permissions to check for.
    */
    function hasPermissions(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] memory _permissionIndexes
    ) external view override returns (bool) {
        for (uint256 _i = 0; _i < _permissionIndexes.length; _i++) {
            uint256 _permissionIndex = _permissionIndexes[_i];

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
      @notice Sets the permissions for an operator.
      @param _projectId The ID of the project that the operator is being given permissions to operate.
      @param _operator The operator to give permission to.
      @param _permissionIndexes An array of indexes of permissions to allow.
    */
    function setOperator(
        uint256 _projectId,
        address _operator,
        uint256[] memory _permissionIndexes
    ) external override {
        uint256 _packed = _packedPermissions(_permissionIndexes);
        permissions[msg.sender][_projectId][_operator] = _packed;
        emit SetOperator(
            msg.sender,
            _projectId,
            _operator,
            _permissionIndexes,
            _packed,
            msg.sender
        );
    }

    /** 
      @notice Sets permissions for many operators.
      @param _projectIds The IDs of the projects that can be operated. Set to 0 to allow operation of account level actions.
      @param _operators The operators to give permission to.
      @param _permissionIndexes The level of power each operator should have.
    */
    function setOperators(
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[][] memory _permissionIndexes
    ) external override {
        // There should be a level for each operator provided.
        require(
            _operators.length == _permissionIndexes.length &&
                _operators.length == _projectIds.length,
            "OperatorStore::setOperators: BAD_ARGS"
        );
        for (uint256 _i = 0; _i < _operators.length; _i++) {
            uint256 _packed = _packedPermissions(_permissionIndexes[_i]);
            permissions[msg.sender][_projectIds[_i]][_operators[_i]] = _packed;
            emit SetOperator(
                msg.sender,
                _projectIds[_i],
                _operators[_i],
                _permissionIndexes[_i],
                _packed,
                msg.sender
            );
        }
    }

    /** 
      @notice Converts an array of permission indexes to a packed int.
      @param _indexes The indexes of the permissions to pack.
    */
    function _packedPermissions(uint256[] memory _indexes)
        private
        pure
        returns (uint256)
    {
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

        return _packed;
    }
}
