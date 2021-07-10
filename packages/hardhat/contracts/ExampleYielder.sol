// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./interfaces/IYielder.sol";

/// @dev For testing purposes.
contract ExampleYielder is IYielder {
    function deposited() external pure override returns (uint256) {
        return 0;
    }

    function getCurrentBalance() external pure override returns (uint256) {
        return 0;
    }

    function deposit() external payable override {}

    function withdraw(uint256 _amount, address payable _beneficiary)
        external
        override
    {}

    function withdrawAll(address payable _beneficiary)
        external
        override
        returns (uint256)
    {}
}
