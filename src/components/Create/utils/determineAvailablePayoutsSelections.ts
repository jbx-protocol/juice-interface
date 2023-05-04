import { BigNumber } from 'ethers'
import { PayoutsSelection } from 'models/payoutsSelection'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

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
