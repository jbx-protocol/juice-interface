// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IOperatorStore.sol";

interface IOperatable {
    function operatorStore() external view returns (IOperatorStore);
}
