import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { FCMetadata } from 'models/funding-cycle'

// packed `metadata` bits format: 0bRRRRRRRRRRRRRRRRBBBBBBBBBBBBBBBBVVVVVVVV
// R bits: reserved
// B bits: bondingCurveRate
// V bits: version

export const decodeFCMetadata = (
  metadata?: BigNumber,
): FCMetadata | undefined =>
  metadata
    ? {
        reserved: metadata.shr(24).toNumber(),
        bondingCurveRate: metadata
          .shr(8)
          .and(0b00000000000000001111111111111111)
          .toNumber(),
      }
    : undefined

export const encodeFCMetadata = (
  reserved: BigNumberish,
  bondingCurveRate: BigNumberish,
): BigNumber =>
  BigNumber.from(0)
    .or(BigNumber.from(bondingCurveRate).shl(8))
    .or(BigNumber.from(reserved).shl(24))
