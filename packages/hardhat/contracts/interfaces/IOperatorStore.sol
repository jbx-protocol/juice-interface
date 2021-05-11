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

    event RemoveOperator(
        address indexed account,
        uint256 indexed projectId,
        address indexed remover,
        address operator
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

    function removeOperator(
        address _account,
        uint256 _projectId,
        address _operator
    ) external;
}
