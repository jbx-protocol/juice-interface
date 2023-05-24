import { FundingCycleRiskFlags } from 'constants/fundingWarningText'
import { MaxUint54 } from 'constants/numbers'
import { BigNumber } from 'ethers'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { isZeroAddress } from 'utils/address'
import unsafeFundingCycleProperties from 'utils/unsafeFundingCycleProperties'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import { fromWad, parseWad } from '../format/formatNumber'
import {
  MAX_DISTRIBUTION_LIMIT,
  computeIssuanceRate,
  formatDiscountRate,
  formatIssuanceRate,
  issuanceRateFrom,
} from './math'
import {
  SerializedV2V3FundAccessConstraint,
  SerializedV2V3FundingCycleData,
} from './serializers'

export const WEIGHT_ZERO = 1 // send `1` when we want to set the weight to `0`
export const WEIGHT_UNCHANGED = 0 // send `0` when we don't want to change the weight.

export const hasDistributionLimit = (
  fundAccessConstraint: SerializedV2V3FundAccessConstraint | undefined,
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
  fundingCycle: Pick<SerializedV2V3FundingCycleData, 'duration'>,
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
 * Returns the terminal addresses for the given fund access constraints.
 */
export function getTerminalsFromFundAccessConstraints(
  fundAccessConstraints: (
    | SerializedV2V3FundAccessConstraint
    | V2V3FundAccessConstraint
  )[],
  defaultJBETHPaymentTerminalAddress: string,
): string[] {
  const fundAccessConstraintTerminals = fundAccessConstraints.map(
    fundAccessConstraint => fundAccessConstraint.terminal,
  )

  // if no terminals, add the default one
  if (fundAccessConstraintTerminals.length === 0) {
    return [defaultJBETHPaymentTerminalAddress]
  }

  return fundAccessConstraintTerminals
}

/**
 * Mark various funding cycle properties as "unsafe",
 * based on a subjective interpretation.
 *
 * If a value in the returned object is true, it is potentially unsafe.
 */
export const getUnsafeV2V3FundingCycleProperties = (
  fundingCycle: V2V3FundingCycle,
  fundingCycleMetadata: V2V3FundingCycleMetadata,
): FundingCycleRiskFlags => {
  const ballot = getBallotStrategyByAddress(fundingCycle.ballot)
  const reservedRatePercentage = parseFloat(
    fromWad(fundingCycleMetadata.reservedRate),
  )
  const allowMinting = Boolean(fundingCycleMetadata.allowMinting)
  const paymentIssuanceRate = computeIssuanceRate(
    fundingCycle,
    fundingCycleMetadata,
    'payer',
  )

  return unsafeFundingCycleProperties({
    ballot,
    reservedRatePercentage,
    hasFundingDuration: fundingCycle.duration?.gt(0),
    allowMinting,
    paymentIssuanceRate,
    useDataSourceForRedeem: fundingCycleMetadata.useDataSourceForRedeem,
  })
}

/**
 * Return number of risk indicators for a funding cycle.
 * 0 if we deem a project "safe" to contribute to.
 */
export const getV2V3FundingCycleRiskCount = (
  fundingCycle: V2V3FundingCycle,
  fundingCycleMetadata: V2V3FundingCycleMetadata,
): number => {
  return Object.values(
    getUnsafeV2V3FundingCycleProperties(fundingCycle, fundingCycleMetadata),
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

// Derives next FC's issuance rate from previous FC's weight and discount
export const deriveNextIssuanceRate = ({
  weight,
  previousFC,
}: {
  weight: BigNumber
  previousFC: V2V3FundingCycle | undefined
}) => {
  const previousWeight = previousFC?.weight
  if (weight.eq(WEIGHT_ZERO)) {
    return BigNumber.from(0)

    // If no previous FC exists, return given weight
  } else if (!previousWeight) {
    return weight

    // If weight=0 passed, derive next weight from previous weight
  } else if (weight.eq(WEIGHT_UNCHANGED)) {
    const weightNumber = parseFloat(
      formatIssuanceRate(previousWeight.toString()),
    )
    const discountRateNumber =
      parseFloat(formatDiscountRate(previousFC.discountRate)) / 100
    const newWeightNumber = Math.round(
      weightNumber - weightNumber * discountRateNumber,
    )

    return BigNumber.from(issuanceRateFrom(newWeightNumber.toString()))
  }
  return weight
}

/**
 * Checks if a given funding cycle has a datasource and if it is set to use the datasource for pay.
 */
export function hasDataSourceForPay(
  fundingCycleMetadata: V2V3FundingCycleMetadata | undefined,
) {
  return Boolean(
    !isZeroAddress(fundingCycleMetadata?.dataSource) &&
      fundingCycleMetadata?.useDataSourceForPay,
  )
}

export function isInfiniteDistributionLimit(distributionLimit: BigNumber) {
  return distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)
}

// Not zero and not infinite
export const isFiniteDistributionLimit = (
  distributionLimit: BigNumber | undefined,
): boolean => {
  return Boolean(
    distributionLimit &&
      !distributionLimit.eq(0) &&
      !isInfiniteDistributionLimit(distributionLimit),
  )
}
