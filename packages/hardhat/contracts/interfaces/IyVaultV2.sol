// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IyVaultV2 is IERC20 {
    function token() external view returns (address);

    function deposit() external returns (uint256);

    function deposit(uint256) external returns (uint256);

    function deposit(uint256, address) external returns (uint256);

    function withdraw() external returns (uint256);

    function withdraw(uint256) external returns (uint256);

    function withdraw(uint256, address) external returns (uint256);

    function withdraw(
        uint256,
        address,
        uint256
    ) external returns (uint256);

    function permit(
        address,
        address,
        uint256,
        uint256,
        bytes32
    ) external view returns (bool);

    function pricePerShare() external view returns (uint256);

    function apiVersion() external view returns (string memory);

    function totalAssets() external view returns (uint256);

    function maxAvailableShares() external view returns (uint256);

    function debtOutstanding() external view returns (uint256);

    function debtOutstanding(address strategy) external view returns (uint256);

    function creditAvailable() external view returns (uint256);

    function creditAvailable(address strategy) external view returns (uint256);

    function availableDepositLimit() external view returns (uint256);

    function expectedReturn() external view returns (uint256);

    function expectedReturn(address strategy) external view returns (uint256);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint256);

    function balanceOf(address owner) external view override returns (uint256);

    function totalSupply() external view override returns (uint256);

    function governance() external view returns (address);

    function management() external view returns (address);

    function guardian() external view returns (address);

    function guestList() external view returns (address);

    function strategies(address)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        );

    function withdrawalQueue(uint256) external view returns (address);

    function emergencyShutdown() external view returns (bool);

    function depositLimit() external view returns (uint256);

    function debtRatio() external view returns (uint256);

    function totalDebt() external view returns (uint256);

    function lastReport() external view returns (uint256);

    function activation() external view returns (uint256);

    function rewards() external view returns (address);

    function managementFee() external view returns (uint256);

    function performanceFee() external view returns (uint256);
}
