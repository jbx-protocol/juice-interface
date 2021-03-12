// Adapted from https://github.com/dapphub/ds-math/blob/master/src/math.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

library DSMath {
    //rounds to zero if x*y < WAD / 2
    function wmul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = add(mul(x, y), 1E18 / 2) / 1E18;
    }

    //rounds to zero if x*y < WAD / 2
    function wdiv(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = add(mul(x, 1E18), y / 2) / y;
    }

    function add(uint256 x, uint256 y) private pure returns (uint256 z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }

    function mul(uint256 x, uint256 y) private pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}
