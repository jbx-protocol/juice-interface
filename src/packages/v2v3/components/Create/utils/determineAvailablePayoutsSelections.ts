import { BigNumber } from '@ethersproject/bignumber'
import { PayoutsSelection } from 'models/payoutsSelection'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'

export const determineAvailablePayoutsSelections = (
  distributionLimit: BigNumber | undefined,
): Set<PayoutsSelection> => {
  if (!distributionLimit) {
    return new Set()
  }
  if (distributionLimit.eq(0)) {
    return new Set(['amounts'])
  }
  if (distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)) {
    return new Set(['percentages'])
  }
  return new Set(['amounts', 'percentages'])
}
