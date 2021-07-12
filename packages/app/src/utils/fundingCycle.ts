import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { constants } from 'ethers'
import { FCMetadata, FundingCycle } from 'models/funding-cycle'

import { EditingFundingCycle } from './serializers'

// packed `metadata` format:  0bRRRRRRRRBBBBBBBBrrrrrrrrVVVVVVVV
// V: version (bits 0-8)
// r: reserved (bits 9-16)
// B: bondingCurveRate (bits 17-24)
// R: reconfigurationBondingCurveRate (bits 25-32)

export const decodeFCMetadata = (
  metadata?: BigNumber,
): FCMetadata | undefined =>
  metadata
    ? {
        version: metadata.and(0b00000000000000000000000011111111).toNumber(),
        reservedRate: metadata
          .shr(8)
          .and(0b000000000000000011111111)
          .toNumber(),
        bondingCurveRate: metadata
          .shr(16)
          .and(0b0000000011111111)
          .toNumber(),
        reconfigurationBondingCurveRate: metadata.shr(24).toNumber(),
      }
    : undefined

export const encodeFCMetadata = (
  reserved: BigNumberish,
  bondingCurveRate: BigNumberish,
  reconfigurationBondingCurveRate: BigNumberish,
): BigNumber =>
  BigNumber.from(0)
    .or(BigNumber.from(reserved).shl(8))
    .or(BigNumber.from(bondingCurveRate).shl(16))
    .or(BigNumber.from(reconfigurationBondingCurveRate).shl(24))

export const isRecurring = (fundingCycle: FundingCycle | EditingFundingCycle) =>
  fundingCycle.discountRate.lt(201)

export const hasFundingTarget = (
  fundingCycle: FundingCycle | EditingFundingCycle,
) => fundingCycle.target.lt(constants.MaxUint256)
