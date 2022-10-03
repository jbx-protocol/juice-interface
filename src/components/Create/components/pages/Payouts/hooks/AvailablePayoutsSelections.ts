import { PayoutsSelection } from 'models/payoutsSelection'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export const useAvailablePayoutsSelections = (): Set<PayoutsSelection> => {
  const [distributionLimit] = useEditingDistributionLimit()
  if (!distributionLimit) {
    return new Set()
  }
  if (distributionLimit.amount.eq(0)) {
    return new Set(['amounts'])
  }
  if (distributionLimit.amount.eq(MAX_DISTRIBUTION_LIMIT)) {
    return new Set(['percentages'])
  }
  return new Set(['amounts', 'percentages'])
}
