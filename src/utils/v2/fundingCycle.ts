import * as constants from '@ethersproject/constants'

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
