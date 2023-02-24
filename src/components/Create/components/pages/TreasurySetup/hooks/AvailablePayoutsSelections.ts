import { determineAvailablePayoutsSelections } from 'components/Create/utils/determineAvailablePayoutsSelections'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'

export const useAvailablePayoutsSelections = (): Set<PayoutsSelection> => {
  const [distributionLimit] = useEditingDistributionLimit()
  return determineAvailablePayoutsSelections(distributionLimit?.amount)
}
