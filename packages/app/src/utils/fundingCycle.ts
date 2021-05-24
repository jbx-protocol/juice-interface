import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { FCMetadata, FundingCycle } from 'models/funding-cycle'

import { EditingFundingCycle } from './serializers'

// packed `metadata` format:  0bRRRRRRRRRRRRRRRRrrrrrrrrrrrrrrrrBBBBBBBBBBBBBBBBVVVVVVVV
// V: version (bits 0-8)
// B: bondingCurveRate (bits 9-24)
// r: reserved (bits 25-40)
// R: reconfigurationBondingCurveRate (bits 41-56)

export const decodeFCMetadata = (
  metadata?: BigNumber,
): FCMetadata | undefined =>
  metadata
    ? {
        version: metadata
          .and(0b00000000000000000000000000000000000000000000000011111111)
          .toNumber(),
        bondingCurveRate: metadata
          .shr(8)
          .and(0b000000000000000000000000000000001111111111111111)
          .toNumber(),
        reserved: metadata
          .shr(24)
          .and(0b00000000000000001111111111111111)
          .toNumber(),
        reconfigurationBondingCurveRate: metadata.shr(40).toNumber(),
      }
    : undefined

export const encodeFCMetadata = (
  reserved: BigNumberish,
  bondingCurveRate: BigNumberish,
  reconfigurationBondingCurveRate: BigNumberish,
): BigNumber =>
  BigNumber.from(0)
    .or(BigNumber.from(bondingCurveRate).shl(8))
    .or(BigNumber.from(reserved).shl(24))
    .or(BigNumber.from(reconfigurationBondingCurveRate).shl(40))

export const isRecurring = (fundingCycle: FundingCycle | EditingFundingCycle) =>
  fundingCycle.discountRate > 0
