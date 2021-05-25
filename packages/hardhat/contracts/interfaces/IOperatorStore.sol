// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IOperatorStore {
    event AddPermission(
        address indexed account,
        uint256 indexed projectId,
        address indexed operator,
        uint256[] _indexes
    );

    event AddPermissions(
        address indexed account,
        uint256[] indexed projectIds,
        address[] indexed operators,
        uint256[][] _indexes
    );

    event RemovePermission(
        address indexed account,
        uint256 indexed projectId,
        address indexed operator,
        address caller
    );

    event RemovePermissions(
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

    function addPermission(
        uint256 _projectId,
        address _operator,
        uint256[] memory _indexes
    ) external;

    function addPermissions(
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[][] memory _indexes
    ) external;

    function removePermission(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] memory _indexes
    ) external;

    function removePermissions(
        address _account,
        uint256[] memory _projectIds,
        address[] memory _operator,
        uint256[][] memory _indexes
    ) external;
}
