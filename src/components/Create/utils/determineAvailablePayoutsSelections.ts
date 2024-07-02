import { PayoutsSelection } from 'models/payoutsSelection'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'

export const determineAvailablePayoutsSelections = (
  distributionLimit: bigint | undefined,
): Set<PayoutsSelection> => {
  if (!distributionLimit) {
    return new Set()
  }
  if (distributionLimit === 0n) {
    return new Set(['amounts'])
  }
  if (isInfiniteDistributionLimit(distributionLimit)) {
    return new Set(['percentages'])
  }
  return new Set(['amounts', 'percentages'])
}
