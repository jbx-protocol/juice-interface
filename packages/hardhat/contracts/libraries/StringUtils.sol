// Adapted from https://gist.github.com/thomasmaclean/276cb6e824e48b7ca4372b194ec05b97
// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

library StringUtils {
    function toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint256 _i = 0; _i < bStr.length; _i++) {
            // Uppercase character...
            if ((uint8(bStr[_i]) >= 65) && (uint8(bStr[_i]) <= 90)) {
                // So we add 32 to make it lowercase
                bLower[_i] = bytes1(uint8(bStr[_i]) + 32);
            } else {
                bLower[_i] = bStr[_i];
            }
        }
        return string(bLower);
    }
}
