// // SPDX-License-Identifier: MIT
// pragma solidity 0.7.6;
// pragma experimental ABIEncoderV2;

// import {
//     ILendingPool
// } from "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
// import {
//     ILendingPoolAddressesProvider
// } from "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol";
// import {IAToken} from "@aave/protocol-v2/contracts/interfaces/IAToken.sol";
// import {
//     DataTypes
// } from "@aave/protocol-v2/contracts/protocol/libraries/types/DataTypes.sol";
// import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

// import "./../interfaces/IOverflowYielder.sol";
// import "./../interfaces/IJuicer.sol";

// contract YearnYielder is IYielder {
//     using SafeERC20 for IERC20;

//     IJuicer public override juicer;

//     ILendingPoolAddressesProvider public provider;

//     modifier onlyJuicer {
//         require(
//             msg.sender == address(juicer),
//             "AaveOverflowLender: UNAUTHORIZED"
//         );
//         _;
//     }

//     constructor(IJuicer _juicer, ILendingPoolAddressesProvider _provider)
//         public
//     {
//         juicer = _juicer;
//         provider = _provider;
//     }

//     function getBalance(IERC20 _token)
//         external
//         view
//         override
//         returns (uint256)
//     {
//         DataTypes.ReserveData memory _reserveData =
//             ILendingPool(provider.getLendingPool()).getReserveData(
//                 address(_token)
//             );

//         return IAToken(_reserveData.aTokenAddress).balanceOf(address(juicer));
//     }

//     function getRate(IERC20 _token) external view override returns (uint128) {
//         ILendingPool(provider.getLendingPool())
//             .getReserveData(address(_token))
//             .currentLiquidityRate;
//     }

//     function deposit(uint256 _amount, IERC20 _token)
//         external
//         override
//         onlyJuicer
//     {
//         _token.safeTransferFrom(address(juicer), address(this), _amount);
//         ILendingPool(provider.getLendingPool()).deposit(
//             address(_token),
//             _amount,
//             address(this),
//             0
//         );
//     }

//     function withdraw(uint256 _amount, IERC20 _token)
//         external
//         override
//         onlyJuicer
//     {
//         ILendingPool(provider.getLendingPool()).withdraw(
//             address(_token),
//             _amount,
//             address(juicer)
//         );
//     }

//     function withdrawAll(IERC20 _token)
//         external
//         override
//         onlyJuicer
//         returns (uint256 amountEarning)
//     {
//         DataTypes.ReserveData memory _reserveData =
//             ILendingPool(provider.getLendingPool()).getReserveData(
//                 address(_token)
//             );

//         amountEarning = IAToken(_reserveData.aTokenAddress).balanceOf(
//             address(this)
//         );

//         ILendingPool(provider.getLendingPool()).withdraw(
//             address(_token),
//             amountEarning,
//             address(juicer)
//         );
//     }
// }
