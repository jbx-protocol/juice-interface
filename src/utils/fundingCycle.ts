import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { constants } from 'ethers'
import { FundingCycle } from 'models/funding-cycle'
import { FundingCycleMetadata } from 'models/funding-cycle-metadata'

import { EditingFundingCycle } from './serializers'

// packed `metadata` format: 0btTPRRRRRRRRBBBBBBBBrrrrrrrrVVVVVVVV
// V: version (bits 0-7)
// r: reserved (bits 8-15)
// B: bondingCurveRate (bits 16-23)
// R: reconfigurationBondingCurveRate (bits 24-31)
// P: payIsPaused (bit 32)
// T: ticketPrintingIsAllowed (bits 33)
// t: treasuryExtension (bits 34-194)

export const decodeFundingCycleMetadata = (
  metadata?: BigNumber,
): FundingCycleMetadata | undefined =>
  metadata
    ? {
        version: metadata.and(0b11111111).toNumber(),
        reservedRate: metadata.shr(8).and(0b11111111).toNumber(),
        bondingCurveRate: metadata.shr(16).and(0b11111111).toNumber(),
        reconfigurationBondingCurveRate: metadata
          .shr(24)
          .and(0b11111111)
          .toNumber(),
        ticketPrintingIsAllowed: Boolean(metadata.shr(32).and(0b1)),
        payIsPaused: Boolean(metadata.shr(33).and(0b1)),
        treasuryExtension: metadata.shr(34).toHexString(),
      }
    : undefined

export const encodeFundingCycleMetadata = (
  reserved: BigNumberish,
  bondingCurveRate: BigNumberish,
  reconfigurationBondingCurveRate: BigNumberish,
  payIsPaused: boolean,
  ticketPrintingIsAllowed: boolean,
  treasuryExtension: string,
): BigNumber =>
  BigNumber.from(0)
    .or(BigNumber.from(reserved).shl(8))
    .or(BigNumber.from(bondingCurveRate).shl(16))
    .or(BigNumber.from(reconfigurationBondingCurveRate).shl(24))
    .or(BigNumber.from(payIsPaused ? 1 : 0).shl(32))
    .or(BigNumber.from(ticketPrintingIsAllowed ? 1 : 0).shl(33))
    .or(BigNumber.from(treasuryExtension).shl(34))

export const isRecurring = (fundingCycle: FundingCycle | EditingFundingCycle) =>
  fundingCycle.discountRate.lt(201)

export const hasFundingTarget = (
  fundingCycle: FundingCycle | EditingFundingCycle,
) => fundingCycle.target.lt(constants.MaxUint256)
