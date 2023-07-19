import { t } from '@lingui/macro'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useMemo } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'
import { useDistributableAmount } from './useDistributableAmount'

export const useTreasuryStats = () => {
  const {
    distributionLimit,
    distributionLimitCurrency: distributionLimitCurrencyRaw,
    balanceInDistributionLimitCurrency,
    primaryTerminalCurrentOverflow,
    fundingCycleMetadata,
  } = useProjectContext()
  const { distributableAmount } = useDistributableAmount()

  const distributionLimitCurrency: V2V3CurrencyOption | undefined =
    useMemo(() => {
      if (!distributionLimitCurrencyRaw) return undefined
      if (distributionLimitCurrencyRaw.eq(0)) return V2V3_CURRENCY_ETH // treat as eth
      return distributionLimitCurrencyRaw.toNumber() as V2V3CurrencyOption
    }, [distributionLimitCurrencyRaw])

  const treasuryBalance = useMemo(() => {
    if (!balanceInDistributionLimitCurrency) return undefined
    return formatCurrencyAmount({
      amount: Number(fromWad(balanceInDistributionLimitCurrency)),
      currency: distributionLimitCurrency,
    })
  }, [balanceInDistributionLimitCurrency, distributionLimitCurrency])

  const { weiToUsd } = useCurrencyConverter()

  const overflow = useMemo(() => {
    if (!distributionLimit) return undefined
    if (isInfiniteDistributionLimit(distributionLimit)) return t`No overflow`

    const overflowInDistributionLimitCurrency =
      distributionLimitCurrency === V2V3_CURRENCY_ETH
        ? fromWad(primaryTerminalCurrentOverflow)
        : weiToUsd(primaryTerminalCurrentOverflow)

    return formatCurrencyAmount({
      amount: overflowInDistributionLimitCurrency?.toString(),
      currency: distributionLimitCurrency,
    })
  }, [
    primaryTerminalCurrentOverflow,
    distributionLimitCurrency,
    distributionLimit,
    weiToUsd,
  ])

  const availableToPayout = useMemo(() => {
    return formatCurrencyAmount({
      amount: Number(fromWad(distributableAmount)),
      currency: distributionLimitCurrency,
    })
  }, [distributableAmount, distributionLimitCurrency])
  return {
    treasuryBalance,
    availableToPayout,
    overflow,
    redemptionRate: fundingCycleMetadata?.redemptionRate,
  }
}
