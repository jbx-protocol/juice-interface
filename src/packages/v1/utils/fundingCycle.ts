import {
  V1FundingCycle,
  V1FundingCycleMetadata,
} from 'packages/v1/models/fundingCycle'
import { perbicentToPercent } from 'utils/format/formatNumber'
import unsafeFundingCycleProperties from 'utils/unsafeFundingCycleProperties'

import { getBallotStrategyByAddress } from 'packages/v1/constants/ballotStrategies/getBallotStrategiesByAddress'

import { FundingCycleRiskFlags } from 'constants/fundingWarningText'
import { ethers } from 'ethers'
import { toHexString } from 'utils/bigNumbers'
import { EditingV1FundingCycle } from './serializers'

const DISCOUNT_RATE_NON_RECURRING = 201n

// packed `metadata` format: 0btTPRRRRRRRRBBBBBBBBrrrrrrrrVVVVVVVV
// V: version (bits 0-7)
// r: reserved (bits 8-15)
// B: bondingCurveRate (bits 16-23)
// R: reconfigurationBondingCurveRate (bits 24-31)
// P: payIsPaused (bit 32)
// T: ticketPrintingIsAllowed (bits 33)
// t: treasuryExtension (bits 34-194)

const bits8 = 0b11111111n
const bits1 = 0b1n

export const decodeFundingCycleMetadata = (
  metadata?: bigint,
): V1FundingCycleMetadata | undefined => {
  if (!metadata) return

  const version = Number(metadata & bits8) as V1FundingCycleMetadata['version']

  return {
    version,
    reservedRate: Number((metadata >> 8n) & bits8),
    bondingCurveRate: Number((metadata >> 16n) & bits8),
    reconfigurationBondingCurveRate: Number((metadata >> 24n) & bits8),
    payIsPaused: version === 0 ? null : Boolean((metadata >> 32n) & bits1),
    ticketPrintingIsAllowed:
      version === 0 ? null : Boolean((metadata >> 33n) & bits1),
    treasuryExtension: version === 0 ? null : toHexString(metadata >> 34n),
  } as V1FundingCycleMetadata
}

/**
 * From the FundingCycles.sol contract:
 *    If discountRate is 201, an non-recurring funding cycle will get made.
 */
export const isRecurring = (
  fundingCycle: V1FundingCycle | EditingV1FundingCycle,
) => fundingCycle.discountRate < DISCOUNT_RATE_NON_RECURRING

export const hasFundingTarget = (
  fundingCycle: Pick<V1FundingCycle | EditingV1FundingCycle, 'target'>,
) => fundingCycle.target < ethers.MaxUint256

const hasFundingDuration = (
  fundingCycle: Pick<V1FundingCycle | EditingV1FundingCycle, 'duration'>,
) =>
  !!fundingCycle.duration &&
  fundingCycle.duration !== BigInt(ethers.ZeroAddress)

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
