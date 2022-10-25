import { formatFundingTarget } from 'components/Create/utils/formatFundingTarget'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'

export const useFundingTarget = () => {
  const [distributionLimit] = useEditingDistributionLimit()

  if (!distributionLimit) return null

  return formatFundingTarget({
    distributionLimitWad: distributionLimit.amount,
    distributionLimitCurrency: distributionLimit.currency,
  })
}
