import { constants } from 'ethers'

import { parseWad } from './formatNumber'

import {
  SerializedV2FundAccessConstraint,
  SerializedV2FundingCycleData,
} from './v2/serializers'

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
