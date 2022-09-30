import { BigNumber } from '@ethersproject/bignumber'
import { useAppSelector } from 'hooks/AppSelector'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

function formatFundingTarget({
  distributionLimit,
  distributionLimitCurrency = '1',
}: {
  distributionLimit: string | undefined
  distributionLimitCurrency: string | undefined
}) {
  const limit = BigNumber.from(distributionLimit)
  if (limit.eq(0)) {
    return 'No target'
  }
  if (limit.eq(MAX_DISTRIBUTION_LIMIT)) {
    return 'Infinite'
  }

  return formatCurrencyAmount({
    amount: limit.toNumber(),
    currency: parseInt(distributionLimitCurrency) as V2V3CurrencyOption,
  })
}

export const useFundingTarget = () => {
  const { fundAccessConstraints } = useAppSelector(
    state => state.editingV2Project,
  )

  if (!fundAccessConstraints.length) return null

  if (!fundAccessConstraints[0]?.distributionLimit.length) return null

  return formatFundingTarget(fundAccessConstraints[0])
}
