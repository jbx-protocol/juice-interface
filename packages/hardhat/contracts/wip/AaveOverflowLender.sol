// // SPDX-License-Identifier: MIT
// pragma solidity 0.6.12;
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

// import "./interfaces/IOverflowLender.sol";
// import "./interfaces/IJuicer.sol";

// contract AaveOverflowLender is IOverflowLender {
//     /// @notice The amount of principal deposited.
//     uint256 public override deposited = 0;

//     ILendingPoolAddressesProvider public override provider;

//     constructor(ILendingPoolAddressesProvider _provider) public {
//         provider = _provider;
//     }

//     function getDepositedAmount(IJuicer _juicer)
//         external
//         view
//         returns (uint256)
//     {
//         IERC20 _token = _juicer.stablecoin();

//         DataTypes.ReserveData memory _reserveData =
//             ILendingPool(provider.getLendingPool()).getReserveData(
//                 address(_token)
//             );

//         IAToken aToken = IAToken(_reserveData.aTokenAddress);

//         return aToken.balanceOf(_juicer);
//     }

//     function getTotalOverflow(IJuicer _juicer) external view returns (uint256) {
//         IERC20 _token = _juicer.stablecoin();
//         DataTypes.ReserveData memory _reserveData =
//             ILendingPool(provider.getLendingPool()).getReserveData(
//                 address(_token)
//             );

//         uint256 _amountEarning =
//             IAToken(_reserveData.aTokenAddress).balanceOf(address(_juicer));

//         uint256 _stablecoinBalance = _token.balanceOf(address(_juicer));
//         return
//             _amountEarning
//                 .add(_stablecoinBalance)
//                 .mul(_juicer.ticketStore.totalClaimable())
//                 .div(deposited.add(_stablecoinBalance));
//     }

//     function recalibrateDeposit(IJuicer _juicer) external {
//         IERC20 _token = _juicer.stablecoin();

//         uint256 _totalClaimable = _juicer.ticketStore().totalClaimable();

//         DataTypes.ReserveData memory _reserveData =
//             ILendingPool(provider.getLendingPool()).getReserveData(
//                 address(_token)
//             );

//         uint256 _amountEarning =
//             IAToken(_reserveData.aTokenAddress).balanceOf(this);

//         if (
//             _amountEarning.mul(100).div(_totalClaimable) >
//             depositRecalibrationTarget
//         ) {
//             uint256 _amount =
//                 _amountEarning.sub(
//                     _totalClaimable.mul(depositRecalibrationTarget).div(1000)
//                 );
//             ILendingPool(provider.getLendingPool()).withdraw(
//                 address(_token),
//                 _amount,
//                 _juicer
//             );

//             deposited = deposited.sub(
//                 _amount.mul(deposited).div(_amountEarning)
//             );
//         } else {
//             uint256 _amount =
//                 _totalClaimable.mul(depositRecalibrationTarget).div(1000).sub(
//                     _amountEarning
//                 );

//             deposited = deposited.add(_amount);

//             // TODO allowance.
//             ILendingPool(provider.getLendingPool()).deposit(
//                 address(_token),
//                 _amount,
//                 address(this),
//                 0
//             );
//         }
//     }
// }
