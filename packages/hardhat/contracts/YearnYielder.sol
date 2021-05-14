// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./interfaces/IYielder.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IyVaultV2.sol";
import "./interfaces/WETH.sol";
import "./libraries/FullMath.sol";

contract YearnYielder is IYielder, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IyVaultV2 public wethVault =
        IyVaultV2(0xa9fE4601811213c340e850ea305481afF02f5b28);

    address public override weth;

    uint256 public override deposited = 0;

    constructor(address _weth) {
        require(wethVault.token() == _weth, "YearnYielder: INCOMPATIBLE");
        weth = _weth;
        updateApproval();
    }

    function getCurrentBalance() public view override returns (uint256) {
        return _sharesToTokens(wethVault.balanceOf(address(this)));
    }

    function deposit() external payable override onlyOwner {
        WETH(weth).deposit{value: msg.value}();
        wethVault.deposit(msg.value);
        deposited = deposited.add(msg.value);
    }

    function withdraw(uint256 _amount, address payable _beneficiary)
        public
        override
        onlyOwner
    {
        // Reduce the proportional amount that has been deposited before the withdrawl.
        deposited = deposited.sub(
            FullMath.mulDiv(_amount, deposited, getCurrentBalance())
        );

        // Withdraw the amount of tokens from the vault.
        wethVault.withdraw(_tokensToShares(_amount));

        // Convert weth back to eth.
        WETH(weth).withdraw(_amount);

        // Move the funds to the Juicer.
        _beneficiary.transfer(_amount);
    }

    /// @dev Updates the vaults approval of the token to be the maximum value.
    function updateApproval() public override {
        IERC20(weth).safeApprove(address(wethVault), uint256(-1));
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
            FullMath.mulDiv(_sharesAmount, wethVault.pricePerShare(), 10**18);
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
            FullMath.mulDiv(_tokensAmount, 10**18, wethVault.pricePerShare());
    }
}
