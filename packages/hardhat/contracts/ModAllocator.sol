// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IModAllocator.sol";

// A static mod allocator contract to use locally.
contract ModAllocator is IModAllocator {
    function allocate(
        uint256 _projectId,
        uint256 _forProjectId,
        address _beneficiary,
        string calldata _memo
    ) external payable override {}
}
