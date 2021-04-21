// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IYielder.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IyVaultV2.sol";
import "./libraries/FullMath.sol";

contract YearnYielder is IYielder {
    using SafeMath for uint256;

    modifier onlyJuicer {
        require(msg.sender == address(juicer), "YearnYielder: UNAUTHORIZED");
        _;
    }

    IJuicer public override juicer;

    IyVaultV2 public vault;

    uint256 public override deposited = 0;

    constructor(IJuicer _juicer, IyVaultV2 _vault) {
        juicer = _juicer;
        vault = _vault;
    }

    function getCurrentBalance() public view override returns (uint256) {
        return _sharesToTokens(vault.balanceOf(address(this)));
    }

    function deposit(uint256 _amount) external override onlyJuicer {
        vault.deposit(_amount);
        deposited = deposited.add(_amount);
    }

    function withdraw(uint256 _amount) public override onlyJuicer {
        // Withdraw the amount of tokens from teh vault.
        vault.withdraw(_tokensToShares(_amount));

        // Reduce the proportional amount that has been deposited.
        deposited = deposited.sub(
            FullMath.mulDiv(_amount, deposited, getCurrentBalance())
        );
    }

    function withdrawAll()
        external
        override
        onlyJuicer
        returns (uint256 _balance)
    {
        _balance = getCurrentBalance();
        withdraw(_balance);
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
        return FullMath.mulDiv(_sharesAmount, vault.pricePerShare(), 10**18);
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
        return FullMath.mulDiv(_tokensAmount, 10**18, vault.pricePerShare());
    }
}
