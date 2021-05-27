// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IOperatorStore.sol";

/** 
  @notice
  Addresses can give permissions to any other address to take specific actions 
  throughout the Juice ecosystem on their behalf. These addresses are called `operators`.
  
  @dev
  Permissions are stored as a uint256, with each boolean bit representing whether or not
  an oporator has the permission identified by that bit's index in the 256 bit uint256.
  Indexes must be between 0 and 255.

  The directory of permissions, along with how they uniquely mapp to indexes, are managed externally.
  This contract doesn't know or care about specific permissions and their indexes.
*/
contract OperatorStore is IOperatorStore {
    // --- public stored properties --- //

    /// @notice
    /// The permissions that an operator has to operate on a specific project ID owned by an account.
    ///
    /// @dev
    /// An account can give an operator permissions that only pertain to a specific project they own.
    /// Since there is no project with an ID of 0, accounts can use the 0 project ID to give an operators
    /// permissions to operator on their personal behalf.
    mapping(address => mapping(uint256 => mapping(address => uint256)))
        public
        override permissions;

    // --- public views --- //

    /** 
      @notice 
      Whether or not an operator has the permission to take a certain action pertaining to the specified account's project.

      @param _account The account that has given out permission to the operator.
      @param _projectId The ID of the project that the operator has been given permissions to operate.
      @param _operator The operator to check.
      @param _permissionIndex the permission to check for.

      @return Whether the operator has the specified permission.
    */
    function hasPermission(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256 _permissionIndex
    ) external view override returns (bool) {
        require(
            _permissionIndex <= 255,
            "OperatorStore::hasPermission: BAD_INDEX"
        );
        return
            ((permissions[_account][_projectId][_operator] >>
                _permissionIndex) & 1) == 1;
    }

    /** 
      @notice 
      Whether or not an operator has the permission to take certain actions pertaining to the specified account's project.

      @param _account The account that has given out permissions to the operator.
      @param _projectId The ID of the project that the operator has been given permissions to operate.
      @param _operator The operator to check.
      @param _permissionIndexes An array of permission indexes to check for.

      @return Whether the operator has all specified permissions.
    */
    function hasPermissions(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] calldata _permissionIndexes
    ) external view override returns (bool) {
        for (uint256 _i = 0; _i < _permissionIndexes.length; _i++) {
            uint256 _permissionIndex = _permissionIndexes[_i];

            require(
                _permissionIndex <= 255,
                "OperatorStore::hasPermissions: BAD_INDEX"
            );

            if (
                ((permissions[_account][_projectId][_operator] >>
                    _permissionIndex) & 1) == 0
            ) return false;
        }
        return true;
    }

    // --- external transactions --- //

    /** 
      @notice 
      Sets permissions for an operator.

      @param _projectId The ID of the project that the operator is being given permissions to operate.
      @param _operator The operator to give permission to.
      @param _permissionIndexes An array of indexes of permissions to set.
    */
    function setOperator(
        uint256 _projectId,
        address _operator,
        uint256[] calldata _permissionIndexes
    ) external override {
        // Pack the indexes into a uint256.
        uint256 _packed = _packedPermissions(_permissionIndexes);

        // Store the new value.
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
      @notice 
      Sets permissions for many operators.

      @param _projectIds The IDs of the projects that can be operated. Set to 0 to allow operation of account level actions.
      @param _operators The operators to give permission to.
      @param _permissionIndexes The level of power each operator should have.
    */
    function setOperators(
        uint256[] calldata _projectIds,
        address[] calldata _operators,
        uint256[][] calldata _permissionIndexes
    ) external override {
        // There should be a level for each operator provided.
        require(
            _operators.length == _permissionIndexes.length &&
                _operators.length == _projectIds.length,
            "OperatorStore::setOperators: BAD_ARGS"
        );
        for (uint256 _i = 0; _i < _operators.length; _i++) {
            // Pack the indexes into a uint256.
            uint256 _packed = _packedPermissions(_permissionIndexes[_i]);
            // Store the new value.
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

    // --- private helper functions --- //

    /** 
      @notice 
      Converts an array of permission indexes to a packed int.

      @param _indexes The indexes of the permissions to pack.

      @return packed The packed result.
    */
    function _packedPermissions(uint256[] calldata _indexes)
        private
        pure
        returns (uint256 packed)
    {
        for (uint256 _i = 0; _i < _indexes.length; _i++) {
            uint256 _permissionIndex = _indexes[_i];
            require(
                _permissionIndex <= 255,
                "OperatorStore::_packedPermissions: BAD_INDEX"
            );
            // Turn the bit at the index on.
            packed |= 1 << _permissionIndex;
        }
    }
}
