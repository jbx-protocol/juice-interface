import * as constants from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { getAddress } from '@ethersproject/address'
import { V2FundingCycleMetadata } from 'models/v2/fundingCycle'

import { invertPermyriad } from 'utils/bigNumbers'

import { parseWad } from '../formatNumber'

import {
  SerializedV2FundAccessConstraint,
  SerializedV2FundingCycleData,
} from './serializers'

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
    dataSource: getAddress(
      packedMetadata
        .shr(8 + 16 + 16 + 16 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1)
        .toHexString(),
    ), // hex, contract address
  }

  return metadata
}
