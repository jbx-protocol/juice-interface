import * as constants from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { getAddress } from '@ethersproject/address'
import {
  V2FundingCycle,
  V2FundingCycleMetadata,
  V2FundingCycleMetadataGlobal,
} from 'models/v2/fundingCycle'

import { invertPermyriad } from 'utils/bigNumbers'
import unsafeFundingCycleProperties from 'utils/unsafeFundingCycleProperties'

import { fromWad, parseWad } from '../formatNumber'

import {
  SerializedV2FundAccessConstraint,
  SerializedV2FundingCycleData,
} from './serializers'
import { FundingCycleRiskFlags } from 'constants/fundingWarningText'
import { getBallotStrategyByAddress } from 'constants/v2/ballotStrategies/getBallotStrategiesByAddress'
import { MAX_DISTRIBUTION_LIMIT } from './math'
import { MaxUint54 } from 'constants/numbers'

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
 * | flags (1 bit each) | ballot redemption rate (16 bits) | redemption rate (16 bits) | reserved rate (16 bits) |     global (16 bits)    | version (8 bits)  |
 * |         p          |        bbbbbbbbbbbbbbbb          |    RRRRRRRRRRRRRRRR       |     rrrrrrrrrrrrrrrr    |     00000000000000tt    |     VVVVVVVV      |
 */

const bits16 = 0b1111111111111111
const bits8 = 0b11111111
const bits1 = 0b1

const bigNumberToBoolean = (val: BigNumber) => Boolean(val.toNumber())

const parameters: {
  name: keyof V2FundingCycleMetadata
  bits: 0 | 1 | 8 | 16
  parser?: (
    val: BigNumber,
  ) =>
    | string
    | boolean
    | BigNumber
    | number
    | undefined
    | V2FundingCycleMetadataGlobal
}[] = [
  {
    name: 'version',
    bits: 8,
    parser: (val: BigNumber) =>
      val.toNumber() as V2FundingCycleMetadata['version'],
  },
  {
    name: 'global',
    bits: 16,
    parser: val => {
      return {
        allowSetTerminals: bigNumberToBoolean(BigNumber.from(val).and(1)),
        allowSetController: bigNumberToBoolean(
          BigNumber.from(val).shr(1).and(1),
        ),
      }
    },
  },
  { name: 'reservedRate', bits: 16 },
  { name: 'redemptionRate', bits: 16, parser: invertPermyriad },
  { name: 'ballotRedemptionRate', bits: 16, parser: invertPermyriad },
  { name: 'pausePay', bits: 1, parser: bigNumberToBoolean },
  {
    name: 'pauseDistributions',
    bits: 1,
    parser: bigNumberToBoolean,
  },
  { name: 'pauseRedeem', bits: 1, parser: bigNumberToBoolean },
  { name: 'pauseBurn', bits: 1, parser: bigNumberToBoolean },
  { name: 'allowMinting', bits: 1, parser: bigNumberToBoolean },
  { name: 'allowChangeToken', bits: 1, parser: bigNumberToBoolean },
  {
    name: 'allowTerminalMigration',
    bits: 1,
    parser: bigNumberToBoolean,
  },
  {
    name: 'allowControllerMigration',
    bits: 1,
    parser: bigNumberToBoolean,
  },
  { name: 'holdFees', bits: 1, parser: bigNumberToBoolean },
  {
    name: 'useTotalOverflowForRedemptions',
    bits: 1,
    parser: bigNumberToBoolean,
  },
  {
    name: 'useDataSourceForPay',
    bits: 1,
    parser: bigNumberToBoolean,
  },
  {
    name: 'useDataSourceForRedeem',
    bits: 1,
    parser: bigNumberToBoolean,
  },
  {
    name: 'dataSource',
    bits: 0,
    parser: val => {
      const dataSource = val.toHexString()
      return dataSource === BigNumber.from('0').toHexString()
        ? constants.AddressZero
        : getAddress(dataSource)
    },
  },
]

export const decodeV2FundingCycleMetadata = (
  packedMetadata: BigNumber,
): V2FundingCycleMetadata => {
  const metadata = parameters.reduce((metadata, parameter, i) => {
    // 1. Get the bits used by the parameter.
    const bits =
      parameter.bits === 16
        ? bits16
        : parameter.bits === 8
        ? bits8
        : parameter.bits === 1
        ? bits1
        : 0

    // 2. Get the amount of bits to shift right by.
    const shiftRightBits =
      i === 0
        ? 0
        : parameters.slice(0, i).reduce((acc, p) => (acc += p.bits), 0)

    // 3. Get the value of the parameter from the bits
    let value
    if (bits === 0) {
      value = packedMetadata.shr(shiftRightBits)
    } else {
      value = packedMetadata.shr(shiftRightBits).and(bits)
    }

    return {
      ...metadata,
      ...{
        [parameter.name]: parameter.parser?.(value) ?? value,
      },
    }
  }, {}) as V2FundingCycleMetadata

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
): FundingCycleRiskFlags => {
  const metadata = decodeV2FundingCycleMetadata(fundingCycle.metadata)
  const ballot = getBallotStrategyByAddress(fundingCycle.ballot)
  const reservedRatePercentage = parseFloat(fromWad(metadata?.reservedRate))
  const allowMinting = Boolean(metadata?.allowMinting)

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
export const V2FundingCycleRiskCount = (
  fundingCycle: V2FundingCycle,
): number => {
  return Object.values(getUnsafeV2FundingCycleProperties(fundingCycle)).filter(
    v => v === true,
  ).length
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
