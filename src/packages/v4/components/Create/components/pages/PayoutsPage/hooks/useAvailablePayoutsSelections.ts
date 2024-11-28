import { PayoutsSelection } from 'models/payoutsSelection'
import { determineAvailablePayoutsSelections } from 'packages/v2v3/components/Create/utils/determineAvailablePayoutsSelections'
import { useCreatingDistributionLimit } from 'redux/hooks/v2v3/create'

export const useAvailablePayoutsSelections = (): Set<PayoutsSelection> => {
  const [distributionLimit] = useCreatingDistributionLimit()
  return determineAvailablePayoutsSelections(distributionLimit?.amount)
}
