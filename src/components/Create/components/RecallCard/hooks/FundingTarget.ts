import { formatFundingTarget } from 'components/Create/utils/formatFundingTarget'
import { useAppSelector } from 'hooks/AppSelector'

export const useFundingTarget = () => {
  const { fundAccessConstraints } = useAppSelector(
    state => state.editingV2Project,
  )

  if (!fundAccessConstraints[0]?.distributionLimit.length) return null

  return formatFundingTarget(fundAccessConstraints[0])
}
