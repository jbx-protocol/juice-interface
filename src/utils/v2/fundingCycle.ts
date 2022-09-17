import { BigNumber } from '@ethersproject/bignumber'
import { V2FundingCycle, V2FundingCycleMetadata } from 'models/v2/fundingCycle'

import unsafeFundingCycleProperties from 'utils/unsafeFundingCycleProperties'

import { fromWad, parseWad } from '../format/formatNumber'

import { FundingCycleRiskFlags } from 'constants/fundingWarningText'
import { MaxUint54 } from 'constants/numbers'
import { getBallotStrategyByAddress } from 'constants/v2/ballotStrategies/getBallotStrategiesByAddress'
import { MAX_DISTRIBUTION_LIMIT } from './math'
import {
  SerializedV2FundAccessConstraint,
  SerializedV2FundingCycleData,
} from './serializers'

export const hasDistributionLimit = (
  fundAccessConstraint: SerializedV2FundAccessConstraint | undefined,
): boolean => {
  // Distribution limit defaults to Zero (which is a distribution limit)
  if (!fundAccessConstraint) return true

  return Boolean(
    !parseWad(fundAccessConstraint.distributionLimit).eq(
      MAX_DISTRIBUTION_LIMIT,
    ),
  )
}

export const hasFundingDuration = (
  fundingCycle: Pick<SerializedV2FundingCycleData, 'duration'>,
) => Boolean(fundingCycle?.duration && fundingCycle?.duration !== '0')

/**
 * Return the default fund access constraint for a project.
 *
 * Projects can have multiple access constraints. This frontend creates one for them,
 * using the default ETH payment terminal.
 */
export function getDefaultFundAccessConstraint<T>(
  fundAccessConstraints: T[],
): T | undefined {
  return fundAccessConstraints[0]
}

/**
 * Mark various funding cycle properties as "unsafe",
 * based on a subjective interpretation.
 *
 * If a value in the returned object is true, it is potentially unsafe.
 */
export const getUnsafeV2FundingCycleProperties = (
  fundingCycle: V2FundingCycle,
  fundingCycleMetadata: V2FundingCycleMetadata,
): FundingCycleRiskFlags => {
  const ballot = getBallotStrategyByAddress(fundingCycle.ballot)
  const reservedRatePercentage = parseFloat(
    fromWad(fundingCycleMetadata.reservedRate),
  )
  const allowMinting = Boolean(fundingCycleMetadata.allowMinting)

  return unsafeFundingCycleProperties({
    ballot,
    reservedRatePercentage,
    hasFundingDuration: fundingCycle.duration?.gt(0),
    allowMinting,
  })
}

/**
 * Return number of risk indicators for a funding cycle.
 * 0 if we deem a project "safe" to contribute to.
 */
export const v2FundingCycleRiskCount = (
  fundingCycle: V2FundingCycle,
  fundingCycleMetadata: V2FundingCycleMetadata,
): number => {
  return Object.values(
    getUnsafeV2FundingCycleProperties(fundingCycle, fundingCycleMetadata),
  ).filter(v => v === true).length
}

/**
 * _mustStartAtOrAfter + _duration > type(uint54).max
 * @param mustStartAtOrAfter
 */
export const isValidMustStartAtOrAfter = (
  mustStartAtOrAfter: string,
  fundingCycleDuration: BigNumber,
): boolean => {
  return BigNumber.from(mustStartAtOrAfter)
    .add(fundingCycleDuration)
    .lt(MaxUint54)
}
