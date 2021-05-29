// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IOperatorStore {
    event SetOperator(
        address indexed account,
        uint256 indexed projectId,
        address indexed operator,
        uint256[] permissionIndexes,
        uint256 packed
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
        uint256[] calldata _permissionIndexes
    ) external view returns (bool);

    function setOperator(
        uint256 _projectId,
        address _operator,
        uint256[] calldata _permissionIndexes
    ) external;

    function setOperators(
        uint256[] calldata _projectIds,
        address[] calldata _operators,
        uint256[][] calldata _permissionIndexes
    ) external;
}
