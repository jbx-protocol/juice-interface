// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IProjects.sol";

interface IControlled {
    function projects() external view returns (IProjects);
}
