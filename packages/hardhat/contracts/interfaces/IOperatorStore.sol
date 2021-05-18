// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

interface IOperatorStore {
    event AddOperator(
        address indexed account,
        uint256 indexed projectId,
        address operator,
        uint256 level
    );

    event AddOperators(
        address indexed account,
        uint256[] indexed projectIds,
        address[] operators,
        uint256[] levels
    );

    event RemoveOperator(
        address indexed account,
        uint256 indexed projectId,
        address indexed remover,
        address operator
    );

    event RemoveOperators(
        address indexed account,
        uint256[] indexed projectId,
        address indexed remover,
        address[] operators
    );

    function operatorLevel(
        address _account,
        uint256 _projectId,
        address _operator
    ) external view returns (uint256);

    function addOperator(
        uint256 _projectId,
        address _operator,
        uint256 _level
    ) external;

    function addOperators(
        uint256[] memory _projectIds,
        address[] memory _operators,
        uint256[] memory _levels
    ) external;

    function removeOperator(
        address _account,
        uint256 _projectId,
        address _operator
    ) external;

    function removeOperators(
        address _account,
        uint256[] memory _projectIds,
        address[] memory _operator
    ) external;
}
