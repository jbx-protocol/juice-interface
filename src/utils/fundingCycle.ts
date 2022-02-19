import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { constants } from 'ethers'
import { V1FundingCycle, V1FundingCycleMetadata } from 'models/v1/fundingCycle'

import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'

import { fromPerbicent } from './formatNumber'

import { EditingV1FundingCycle } from './v1/serializers'
import {
  FundingCycleRiskFlags,
  reservedRateRiskyMin,
} from 'constants/fundingWarningText'

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

export const isRecurring = (
  fundingCycle: V1FundingCycle | EditingV1FundingCycle,
) => fundingCycle.discountRate.lt(201)

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
export const getUnsafeFundingCycleProperties = (
  fundingCycle: V1FundingCycle,
): FundingCycleRiskFlags => {
  const metadata = decodeFundingCycleMetadata(fundingCycle.metadata)

  // when we set one of these values to true, we're saying it's potentially unsafe.
  // This object is based on type FundingCycle
  const configFlags = {
    duration: false,
    ballot: false,
    metadataTicketPrintingIsAllowed: false,
    metadataReservedRate: false,
  }

  /**
   * Ballot address is 0x0000.
   * Funding cycle reconfigurations can be created moments before a new cycle begins,
   * giving project owners an opportunity to take advantage of contributors, for example by withdrawing overflow.
   */
  if (
    getBallotStrategyByAddress(fundingCycle.ballot).address ===
    constants.AddressZero
  ) {
    configFlags.ballot = true
  }

  /**
   * Duration not set. Reconfigurations can be made at any point without notice.
   */
  if (!hasFundingDuration(fundingCycle)) {
    configFlags.duration = true
  }

  /**
   * Token minting is enabled (v1.1).
   * Any supply of tokens could be minted at any time by the project owners, diluting the token share of all existing contributors.
   */
  if (metadata?.ticketPrintingIsAllowed) {
    configFlags.metadataTicketPrintingIsAllowed = true
  }

  /**
   * Reserved rate is very high.
   * Contributors will receive a relatively small portion of tokens (if any) in exchange for paying the project.
   *
   * Note: max reserve rate is 200.
   */
  if (
    parseInt(fromPerbicent(metadata?.reservedRate ?? 0), 10) >=
    reservedRateRiskyMin
  ) {
    configFlags.metadataReservedRate = true
  }

  return configFlags
}

/**
 * Return number of risk indicators for a funding cycle.
 * 0 if we deem a project "safe" to contribute to.
 */
export const fundingCycleRiskCount = (fundingCycle: V1FundingCycle): number => {
  return Object.values(getUnsafeFundingCycleProperties(fundingCycle)).filter(
    v => v === true,
  ).length
}
