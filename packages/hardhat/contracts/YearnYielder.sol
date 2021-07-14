// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@paulrberg/contracts/math/PRBMath.sol";

import "./interfaces/IYielder.sol";
import "./interfaces/ITerminalV1.sol";
import "./interfaces/IyVaultV2.sol";
import "./interfaces/IWETH.sol";

contract YearnYielder is IYielder, Ownable {
    using SafeERC20 for IERC20;

    IyVaultV2 public wethVault =
        IyVaultV2(0xa9fE4601811213c340e850ea305481afF02f5b28);

    address public weth;

    uint256 public override deposited = 0;

    uint256 public decimals;

    constructor(address _weth) {
        require(wethVault.token() == _weth, "YearnYielder: INCOMPATIBLE");
        weth = _weth;
        decimals = IWETH(weth).decimals();
        updateApproval();
    }

    function getCurrentBalance() public view override returns (uint256) {
        return _sharesToTokens(wethVault.balanceOf(address(this)));
    }

    function deposit() external payable override onlyOwner {
        IWETH(weth).deposit{value: msg.value}();
        wethVault.deposit(msg.value);
        deposited = deposited + msg.value;
    }

    function withdraw(uint256 _amount, address payable _beneficiary)
        public
        override
        onlyOwner
    {
        // Reduce the proportional amount that has been deposited before the withdrawl.
        deposited =
            deposited -
            PRBMath.mulDiv(_amount, deposited, getCurrentBalance());

        // Withdraw the amount of tokens from the vault.
        wethVault.withdraw(_tokensToShares(_amount));

        // Convert weth back to eth.
        IWETH(weth).withdraw(_amount);

        // Move the funds to the TerminalV1.
        _beneficiary.transfer(_amount);
    }

    function withdrawAll(address payable _beneficiary)
        external
        override
        onlyOwner
        returns (uint256 _balance)
    {
        _balance = getCurrentBalance();
        withdraw(_balance, _beneficiary);
    }

    /// @dev Updates the vaults approval of the token to be the maximum value.
    function updateApproval() public {
        IERC20(weth).safeApprove(address(wethVault), type(uint256).max);
    }

    /// @dev Computes the number of tokens an amount of shares is worth.
    ///
    /// @param _sharesAmount the amount of shares.
    ///
    /// @return the number of tokens the shares are worth.
    function _sharesToTokens(uint256 _sharesAmount)
        private
        view
        returns (uint256)
    {
        return
            PRBMath.mulDiv(
                _sharesAmount,
                wethVault.pricePerShare(),
                10**decimals
            );
    }

    /// @dev Computes the number of shares an amount of tokens is worth.
    ///
    /// @param _tokensAmount the amount of shares.
    ///
    /// @return the number of shares the tokens are worth.
    function _tokensToShares(uint256 _tokensAmount)
        private
        view
        returns (uint256)
    {
        return
            PRBMath.mulDiv(
                _tokensAmount,
                10**decimals,
                wethVault.pricePerShare()
            );
    }
}
