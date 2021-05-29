// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IModAllocator {
    event Allocate(
        uint256 indexed projectId,
        uint256 indexed forProjectId,
        address indexed beneficiary,
        uint256 amount,
        string note,
        address caller
    );

    function allocate(
        uint256 _projectId,
        uint256 _forProjectId,
        address _beneficiary,
        string calldata _note
    ) external payable;
}
