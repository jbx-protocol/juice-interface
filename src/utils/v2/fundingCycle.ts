import * as constants from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { getAddress } from '@ethersproject/address'
import { V2FundingCycle, V2FundingCycleMetadata } from 'models/v2/fundingCycle'

import { invertPermyriad } from 'utils/bigNumbers'

import { parseWad, permyriadToPercent } from '../formatNumber'

import {
  SerializedV2FundAccessConstraint,
  SerializedV2FundingCycleData,
} from './serializers'
import {
  RESERVED_RATE_WARNING_THRESHOLD_PERCENT,
  V2FundingCycleRiskFlags,
} from 'constants/v2/fundingWarningText'
import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'

export const hasFundingTarget = (
  fundAccessConstraint: SerializedV2FundAccessConstraint | undefined,
) => {
  return (
    fundAccessConstraint?.distributionLimit &&
    !parseWad(fundAccessConstraint.distributionLimit).eq(
      constants.MaxUint256,
    ) &&
    fundAccessConstraint.distributionLimit !== '0'
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
 * | pause pay (1 bit) | ballot redemption rate (16 bits) | redemption rate (16 bits) | reserved rate (16 bits) | version (8 bits)  |
 * |         p         |        bbbbbbbbbbbbbbbb          |    RRRRRRRRRRRRRRRR       |     rrrrrrrrrrrrrrrr    |     VVVVVVVV      |
 */

const bits16 = 0b1111111111111111
const bits8 = 0b11111111
const bits1 = 0b1

export const decodeV2FundingCycleMetadata = (
  packedMetadata: BigNumber,
): V2FundingCycleMetadata => {
  const version = packedMetadata
    .and(bits8)
    .toNumber() as V2FundingCycleMetadata['version']

  const metadata: V2FundingCycleMetadata = {
    version,
    reservedRate: packedMetadata.shr(8).and(bits16),
    redemptionRate: invertPermyriad(packedMetadata.shr(8 + 16).and(bits16)),
    ballotRedemptionRate: invertPermyriad(
      packedMetadata.shr(8 + 16 + 16).and(bits16),
    ),
    pausePay: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16)
        .and(bits1)
        .toNumber(),
    ),
    pauseDistributions: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1)
        .and(bits1)
        .toNumber(),
    ),
    pauseRedeem: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    pauseMint: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    pauseBurn: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    allowChangeToken: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    allowTerminalMigration: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    allowControllerMigration: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    holdFees: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    useLocalBalanceForRedemptions: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    useDataSourceForPay: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    useDataSourceForRedeem: Boolean(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1)
        .and(bits1)
        .toNumber(),
    ),
    dataSource: packedMetadata
      .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1)
      .toHexString(), // hex, contract address
  }

  metadata.dataSource =
    metadata.dataSource === BigNumber.from('0').toHexString()
      ? constants.AddressZero
      : getAddress(metadata.dataSource)

  return metadata
}

/**
 * Mark various funding cycle properties as "unsafe",
 * based on a subjective interpretation.
 *
 * If a value in the returned object is true, it is potentially unsafe.
 */
export const getUnsafeV2FundingCycleProperties = (
  fundingCycle: V2FundingCycle,
): V2FundingCycleRiskFlags => {
  const metadata = decodeV2FundingCycleMetadata(fundingCycle.metadata)

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
  if (!hasFundingDuration({ duration: fundingCycle.duration.toString() })) {
    configFlags.duration = true
  }

  /**
   * Reserved rate is very high.
   * Contributors will receive a relatively small portion of tokens (if any) in exchange for paying the project.
   */
  if (
    parseInt(permyriadToPercent(metadata?.reservedRate ?? 0), 10) >=
    RESERVED_RATE_WARNING_THRESHOLD_PERCENT
  ) {
    configFlags.metadataReservedRate = true
  }

  return configFlags
}

/**
 * Return number of risk indicators for a funding cycle.
 * 0 if we deem a project "safe" to contribute to.
 */
export const V2FundingCycleRiskCount = (
  fundingCycle: V2FundingCycle,
): number => {
  return Object.values(getUnsafeV2FundingCycleProperties(fundingCycle)).filter(
    v => v === true,
  ).length
}
