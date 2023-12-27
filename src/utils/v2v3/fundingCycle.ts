import { FundingCycleRiskFlags } from 'constants/fundingWarningText'
import { MaxUint54 } from 'constants/numbers'
import { BigNumber } from 'ethers'
import { FundingCycle } from 'generated/graphql'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycle,
  V2V3FundingCycleData,
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
  weight?: BigNumber
  previousFC: V2V3FundingCycle | V2V3FundingCycleData | undefined
}) => {
  const previousWeight = previousFC?.weight
  const newWeight = weight ?? BigNumber.from(WEIGHT_UNCHANGED)

  if (newWeight.eq(WEIGHT_ZERO)) {
    return BigNumber.from(0)

    // If no previous FC exists, return given weight
  } else if (!previousWeight) {
    return newWeight

    // If weight=0 passed, derive next weight from previous weight
  } else if (newWeight.eq(WEIGHT_UNCHANGED)) {
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
  return newWeight
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

export function isInfiniteDistributionLimit(
  distributionLimit: BigNumber | undefined,
) {
  return (
    distributionLimit === undefined ||
    distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)
  )
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

// Convert the fundingCycle object returned by subgraph query to the native fundingCycle type used by the app
export const sgFCToV2V3FundingCycle = (
  fc: Pick<
    FundingCycle,
    | 'ballot'
    | 'basedOn'
    | 'configuration'
    | 'discountRate'
    | 'duration'
    | 'metadata'
    | 'number'
    | 'startTimestamp'
    | 'weight'
  >,
): V2V3FundingCycle => ({
  ballot: fc.ballot as string,
  basedOn: BigNumber.from(fc.basedOn),
  configuration: fc.configuration,
  discountRate: fc.discountRate,
  duration: BigNumber.from(fc.duration),
  metadata: fc.metadata,
  number: BigNumber.from(fc.number),
  start: BigNumber.from(fc.startTimestamp),
  weight: fc.weight,
})

// Derive fundingCycleMetdata type from the fundingCycle object returned by subgraph query
export const sgFCToV2V3FundingCycleMetadata = (
  fc: Pick<
    FundingCycle,
    | 'controllerMigrationAllowed'
    | 'mintingAllowed'
    | 'terminalMigrationAllowed'
    | 'ballotRedemptionRate'
    | 'dataSource'
    | 'setControllerAllowed'
    | 'setTerminalsAllowed'
    | 'transfersPaused'
    | 'shouldHoldFees'
    | 'metadata'
    | 'useTotalOverflowForRedemptions'
    | 'burnPaused'
    | 'distributionsPaused'
    | 'pausePay'
    | 'redeemPaused'
    | 'preferClaimedTokenOverride'
    | 'redemptionRate'
    | 'reservedRate'
    | 'useDataSourceForPay'
    | 'useDataSourceForRedeem'
  >,
): V2V3FundingCycleMetadata => ({
  allowChangeToken: false, // only v2, not supported in subgraph
  allowControllerMigration: fc.controllerMigrationAllowed,
  allowMinting: fc.mintingAllowed,
  allowTerminalMigration: fc.terminalMigrationAllowed,
  ballotRedemptionRate: BigNumber.from(fc.ballotRedemptionRate),
  dataSource: fc.dataSource,
  global: {
    allowSetController: fc.setControllerAllowed,
    allowSetTerminals: fc.setTerminalsAllowed,
    pauseTransfers: fc.transfersPaused,
  },
  holdFees: fc.shouldHoldFees,
  metadata: fc.metadata,
  useTotalOverflowForRedemptions: fc.useTotalOverflowForRedemptions,
  pauseBurn: fc.burnPaused,
  pauseDistributions: fc.distributionsPaused,
  pausePay: fc.pausePay,
  pauseRedeem: fc.redeemPaused,
  preferClaimedTokenOverride: fc.preferClaimedTokenOverride,
  redemptionRate: BigNumber.from(fc.redemptionRate),
  reservedRate: BigNumber.from(fc.reservedRate),
  useDataSourceForPay: fc.useDataSourceForPay,
  useDataSourceForRedeem: fc.useDataSourceForRedeem,
})
