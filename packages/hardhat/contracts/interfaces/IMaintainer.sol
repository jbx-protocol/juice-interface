// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMaintainer {
    event CleanTrackedWantToken(address indexed owner, IERC20 token);

    function cleanTrackedWantedTokens(address _owner, IERC20 _token) external;
}
