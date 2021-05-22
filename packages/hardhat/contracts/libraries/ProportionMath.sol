// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./FullMath.sol";

library ProportionMath {
    // Finds the number that increases x the same proportion that y increases z.
    function find(
        uint256 x,
        uint256 y,
        uint256 z
    ) internal pure returns (uint256) {
        require(z > 0);
        return FullMath.mulDiv(x, y + z, z) - x;
    }
}
