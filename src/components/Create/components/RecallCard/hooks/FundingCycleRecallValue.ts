import { t } from '@lingui/macro'
import { formatFundingCycleDuration } from 'components/Create/utils/formatFundingCycleDuration'
import { useAppSelector } from 'hooks/AppSelector'

export const useFundingCycleRecallValue = () => {
  const {
    fundingCycleData: { duration },
  } = useAppSelector(state => state.editingV2Project)

  if (duration === '') return undefined

  if (duration === '0') return t`Manual`

  return formatFundingCycleDuration(duration)
}
