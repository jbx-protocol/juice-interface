import { t } from '@lingui/macro'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useMemo } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'
import { useDistributableAmount } from './useDistributableAmount'

export const useTreasuryStats = () => {
  const {
    distributionLimit,
    distributionLimitCurrency,
    balanceInDistributionLimitCurrency,
  } = useProjectContext()
  const { distributableAmount } = useDistributableAmount()

  const treasuryBalance = useMemo(() => {
    if (!balanceInDistributionLimitCurrency) return undefined
    return formatCurrencyAmount({
      amount: Number(fromWad(balanceInDistributionLimitCurrency)),
      currency: distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
    })
  }, [balanceInDistributionLimitCurrency, distributionLimitCurrency])

  const overflow = useMemo(() => {
    if (!distributionLimit) return undefined
    if (isInfiniteDistributionLimit(distributionLimit)) return t`No overflow`
    if (!balanceInDistributionLimitCurrency) return undefined
    let amount = 0
    if (balanceInDistributionLimitCurrency.gt(distributionLimit ?? 0)) {
      const amountWad = balanceInDistributionLimitCurrency.sub(
        distributionLimit ?? 0,
      )
      amount = Number(fromWad(amountWad))
    }
    return formatCurrencyAmount({
      amount,
      currency: distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
    })
  }, [
    balanceInDistributionLimitCurrency,
    distributionLimit,
    distributionLimitCurrency,
  ])

  const availableToPayout = useMemo(() => {
    return formatCurrencyAmount({
      amount: Number(fromWad(distributableAmount)),
      currency: distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
    })
  }, [distributableAmount, distributionLimitCurrency])
  return {
    treasuryBalance,
    availableToPayout,
    overflow,
  }
}
