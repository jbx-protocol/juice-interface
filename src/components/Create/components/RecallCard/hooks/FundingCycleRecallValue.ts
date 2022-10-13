import { formatFundingCycle } from 'components/Create/utils/formatFundingCycle'
import { useAppSelector } from 'hooks/AppSelector'

export const useFundingCycleRecallValue = () => {
  const {
    fundingCycleData: { duration },
  } = useAppSelector(state => state.editingV2Project)

  if (duration === '') return undefined

  if (duration === '0') return 'No duration'

  return formatFundingCycle(duration)
}
