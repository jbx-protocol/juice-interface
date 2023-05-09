import { useEditingDistributionLimit } from 'redux/hooks/useEditingDistributionLimit'
import { formatFundingTarget } from 'utils/format/formatFundingTarget'

export const useFundingTarget = () => {
  const [distributionLimit] = useEditingDistributionLimit()

  if (!distributionLimit) return null

  return formatFundingTarget({
    distributionLimitWad: distributionLimit.amount,
    distributionLimitCurrency: distributionLimit.currency,
  })
}
