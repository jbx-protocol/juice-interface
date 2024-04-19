import { PayoutsSelection } from 'models/payoutsSelection'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export const determineAvailablePayoutsSelections = (
  distributionLimit: bigint | undefined,
): Set<PayoutsSelection> => {
  if (!distributionLimit) {
    return new Set()
  }
  if (distributionLimit === 0n) {
    return new Set(['amounts'])
  }
  if (distributionLimit === MAX_DISTRIBUTION_LIMIT) {
    return new Set(['percentages'])
  }
  return new Set(['amounts', 'percentages'])
}
