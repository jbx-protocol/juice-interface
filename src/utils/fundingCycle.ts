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

const bits8 = 0b11111111
const bits1 = 0b1

export const decodeFundingCycleMetadata = (
  metadata?: BigNumber,
): FundingCycleMetadata | undefined => {
  if (!metadata) return

  const version = metadata
    .and(bits8)
    .toNumber() as FundingCycleMetadata['version']

  return {
    version,
    reservedRate: metadata.shr(8).and(bits8).toNumber(),
    bondingCurveRate: metadata.shr(16).and(bits8).toNumber(),
    reconfigurationBondingCurveRate: metadata.shr(24).and(bits8).toNumber(),
    payIsPaused:
      version === 0 ? null : Boolean(metadata.shr(32).and(bits1).toNumber()),
    ticketPrintingIsAllowed:
      version === 0 ? null : Boolean(metadata.shr(33).and(bits1).toNumber()),
    treasuryExtension: version === 0 ? null : metadata.shr(34).toHexString(),
  } as FundingCycleMetadata
}

export const encodeFundingCycleMetadata = (
  reserved: BigNumberish,
  bondingCurveRate: BigNumberish,
  reconfigurationBondingCurveRate: BigNumberish,
  payIsPaused: boolean | null,
  ticketPrintingIsAllowed: boolean | null,
  treasuryExtension: string | null,
): BigNumber => {
  let encoded = BigNumber.from(0)
    .or(BigNumber.from(reserved).shl(8))
    .or(BigNumber.from(bondingCurveRate).shl(16))
    .or(BigNumber.from(reconfigurationBondingCurveRate).shl(24))

  if (payIsPaused !== null) {
    encoded = encoded.or(BigNumber.from(payIsPaused ? 1 : 0).shl(32))
  }
  if (ticketPrintingIsAllowed !== null) {
    encoded = encoded.or(
      BigNumber.from(ticketPrintingIsAllowed ? 1 : 0).shl(33),
    )
  }
  if (treasuryExtension !== null) {
    encoded = encoded.or(BigNumber.from(treasuryExtension).shl(34))
  }

  return encoded
}

export const isRecurring = (fundingCycle: FundingCycle | EditingFundingCycle) =>
  fundingCycle.discountRate.lt(201)

export const hasFundingTarget = (
  fundingCycle: Pick<FundingCycle | EditingFundingCycle, 'target'>,
) => fundingCycle.target.lt(constants.MaxUint256)
