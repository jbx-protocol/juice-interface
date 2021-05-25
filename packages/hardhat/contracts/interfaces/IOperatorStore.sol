// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IOperatorStore {
    event AddPermissionsToOperator(
        address indexed account,
        uint256 indexed projectId,
        address indexed operator,
        uint256[] indexes
    );

    event AddPermissionsToOperators(
        address indexed account,
        uint256[] indexed projectIds,
        address[] indexed operators,
        uint256[][] indexes
    );

    event RemovePermissionsFromOperator(
        address indexed account,
        uint256 indexed projectId,
        address indexed operator,
        address caller
    );

    event RemovePermissionsFromOperators(
        address indexed account,
        uint256[] indexed projectId,
        address[] indexed operators,
        address caller
    );

    event SetPackedPermissions(
        address indexed account,
        uint256 indexed projectId,
        address indexed operator,
        uint256 packedPermission,
        address caller
    );

    function permissions(
        address _account,
        uint256 _projectId,
        address _operator
    ) external view returns (uint256);

    function hasPermission(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256 _permissionIndex
    ) external view returns (bool);

    function hasPermissions(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] memory _indexes
    ) external view returns (bool);

    function setPackedPermissions(
        uint256 _projectId,
        address _operator,
        uint256 _packedPermissions
    ) external;

    function addPermissionsToOperator(
        uint256 _projectId,
        address _operator,
        uint256[] memory _indexes
    ) external;

    function addPermissionsToOperators(
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[][] memory _indexes
    ) external;

    function removePermissionsFromOperator(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] memory _indexes
    ) external;

    function removePermissionsFromOperators(
        address _account,
        uint256[] memory _projectIds,
        address[] memory _operator,
        uint256[][] memory _indexes
    ) external;
}
