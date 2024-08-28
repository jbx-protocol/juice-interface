import { PayoutsSelection } from 'models/payoutsSelection'
import { determineAvailablePayoutsSelections } from 'packages/v2v3/components/Create/utils/determineAvailablePayoutsSelections'
import { useEditingDistributionLimit } from 'redux/hooks/useEditingDistributionLimit'

export const useAvailablePayoutsSelections = (): Set<PayoutsSelection> => {
  const [distributionLimit] = useEditingDistributionLimit()
  return determineAvailablePayoutsSelections(distributionLimit?.amount)
}
