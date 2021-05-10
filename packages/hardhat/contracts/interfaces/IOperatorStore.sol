// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

interface IOperatorStore {
    event AddOperator(address indexed account, address operator);

    event RemoveOperator(
        address indexed account,
        address indexed remover,
        address operator
    );

    function isOperator(address _account, address _operator)
        external
        view
        returns (bool);

    function addOperator(address _operator) external;

    function removeOperator(address _account, address _operator) external;
}
