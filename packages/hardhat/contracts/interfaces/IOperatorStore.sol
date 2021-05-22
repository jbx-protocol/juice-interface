// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

interface IOperatorStore {
    event AddOperator(
        address indexed account,
        uint256 indexed projectId,
        address indexed operator,
        uint256[] _permissionIndexes
    );

    event AddOperators(
        address indexed account,
        uint256[] indexed projectIds,
        address[] indexed operators,
        uint256[][] _permissionIndexes
    );

    event RemoveOperator(
        address indexed account,
        uint256 indexed projectId,
        address indexed operator,
        address caller
    );

    event RemoveOperators(
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

    function operatorPermissions(
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
        uint256[] memory _permissionIndexes
    ) external view returns (bool);

    function setPackedPermissions(
        uint256 _projectId,
        address _operator,
        uint256 _packedPermissions
    ) external;

    function addOperator(
        uint256 _projectId,
        address _operator,
        uint256[] memory _permissionIndexe
    ) external;

    function addOperators(
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[][] memory _permissionIndexes
    ) external;

    function removeOperator(
        address _account,
        uint256 _projectId,
        address _operator,
        uint256[] memory _permissionIndexes
    ) external;

    function removeOperators(
        address _account,
        uint256[] memory _projectIds,
        address[] memory _operator,
        uint256[][] memory _permissionIndexes
    ) external;
}
