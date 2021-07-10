// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./interfaces/IModAllocator.sol";

// A static mod allocator contract to use locally.
contract ExampleModAllocator is IModAllocator {
    function allocate(
        uint256 _projectId,
        uint256 _forProjectId,
        address _beneficiary
    ) external payable override {}
}
