import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { constants } from 'ethers'
import { FundingCycle } from 'models/funding-cycle'
import { FundingCycleMetadata } from 'models/funding-cycle-metadata'

import { EditingFundingCycle } from './serializers'

// packed `metadata` format:  0bRRRRRRRRBBBBBBBBrrrrrrrrVVVVVVVV
// V: version (bits 0-8)
// r: reserved (bits 9-16)
// B: bondingCurveRate (bits 17-24)
// R: reconfigurationBondingCurveRate (bits 25-32)

export const decodeFundingCycleMetadata = (
  metadata?: BigNumber,
): FundingCycleMetadata | undefined =>
  metadata
    ? {
        version: metadata.and(0b00000000000000000000000011111111).toNumber(),
        reservedRate: metadata
          .shr(8)
          .and(0b000000000000000011111111)
          .toNumber(),
        bondingCurveRate: metadata.shr(16).and(0b0000000011111111).toNumber(),
        reconfigurationBondingCurveRate: metadata.shr(24).toNumber(),
        payIsPaused: Boolean(metadata.shr(32)),
        ticketPrintingIsAllowed: Boolean(metadata.shr(33)),
      }
    : undefined

export const encodeFundingCycleMetadata = (
  reserved: BigNumberish,
  bondingCurveRate: BigNumberish,
  reconfigurationBondingCurveRate: BigNumberish,
  payIsPaused: boolean,
  ticketPrintingIsAllowed: boolean,
): BigNumber =>
  BigNumber.from(0)
    .or(BigNumber.from(reserved).shl(8))
    .or(BigNumber.from(bondingCurveRate).shl(16))
    .or(BigNumber.from(reconfigurationBondingCurveRate).shl(24))
    .or(payIsPaused ? 1 : 0)
    .shl(32)
    .or(ticketPrintingIsAllowed ? 1 : 0)
    .shl(33)

export const isRecurring = (fundingCycle: FundingCycle | EditingFundingCycle) =>
  fundingCycle.discountRate.lt(201)

export const hasFundingTarget = (
  fundingCycle: FundingCycle | EditingFundingCycle,
) => fundingCycle.target.lt(constants.MaxUint256)
