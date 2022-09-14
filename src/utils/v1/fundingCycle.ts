import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import * as constants from '@ethersproject/constants'
import { V1FundingCycle, V1FundingCycleMetadata } from 'models/v1/fundingCycle'
import { perbicentToPercent } from 'utils/format/formatNumber'
import unsafeFundingCycleProperties from 'utils/unsafeFundingCycleProperties'

import { getBallotStrategyByAddress } from 'constants/v1/ballotStrategies/getBallotStrategiesByAddress'

import { FundingCycleRiskFlags } from 'constants/fundingWarningText'
import { EditingV1FundingCycle } from './serializers'

const DISCOUNT_RATE_NON_RECURRING = 201

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
): V1FundingCycleMetadata | undefined => {
  if (!metadata) return

  const version = metadata
    .and(bits8)
    .toNumber() as V1FundingCycleMetadata['version']

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
  } as V1FundingCycleMetadata
}

export const encodeFundingCycleMetadata = (
  reserved: BigNumberish,
  bondingCurveRate: BigNumberish,
  reconfigurationBondingCurveRate: BigNumberish,
  payIsPaused: boolean | null,
  ticketPrintingIsAllowed: boolean | null,
  treasuryExtension: string | null,
  version: 1 | 0,
): BigNumber => {
  let encoded = BigNumber.from(version)
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

/**
 * From the FundingCycles.sol contract:
 *    If discountRate is 201, an non-recurring funding cycle will get made.
 */
export const isRecurring = (
  fundingCycle: V1FundingCycle | EditingV1FundingCycle,
) => fundingCycle.discountRate.lt(DISCOUNT_RATE_NON_RECURRING)

export const hasFundingTarget = (
  fundingCycle: Pick<V1FundingCycle | EditingV1FundingCycle, 'target'>,
) => fundingCycle.target.lt(constants.MaxUint256)

export const hasFundingDuration = (
  fundingCycle: Pick<V1FundingCycle | EditingV1FundingCycle, 'duration'>,
) => fundingCycle.duration && !fundingCycle.duration.eq(constants.AddressZero)

/**
 * Mark various funding cycle properties as "unsafe",
 * based on a subjective interpretation.
 *
 * If a value in the returned object is true, it is potentially unsafe.
 */
export const getUnsafeV1FundingCycleProperties = (
  fundingCycle: V1FundingCycle,
): FundingCycleRiskFlags => {
  const metadata = decodeFundingCycleMetadata(fundingCycle.metadata)
  const ballot = getBallotStrategyByAddress(fundingCycle.ballot)
  const reservedRatePercentage = parseFloat(
    perbicentToPercent(metadata?.reservedRate),
  )
  const allowMinting = Boolean(metadata?.ticketPrintingIsAllowed)

  return unsafeFundingCycleProperties({
    ballot,
    reservedRatePercentage,
    hasFundingDuration: hasFundingDuration(fundingCycle),
    allowMinting,
  })
}

/**
 * Return number of risk indicators for a funding cycle.
 * 0 if we deem a project "safe" to contribute to.
 */
export const fundingCycleRiskCount = (fundingCycle: V1FundingCycle): number => {
  return Object.values(getUnsafeV1FundingCycleProperties(fundingCycle)).filter(
    v => v === true,
  ).length
}
