import { BigNumber } from 'ethers'
import { PayoutsSelection } from 'models/payoutsSelection'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'

export const determineAvailablePayoutsSelections = (
  distributionLimit: BigNumber | undefined,
): Set<PayoutsSelection> => {
  if (!distributionLimit) {
    return new Set()
  }
  if (distributionLimit.eq(0)) {
    return new Set(['amounts'])
  }
  if (distributionLimit.eq(MAX_PAYOUT_LIMIT)) {
    return new Set(['percentages'])
  }
  return new Set(['amounts', 'percentages'])
}
