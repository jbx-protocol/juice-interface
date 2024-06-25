import { t } from '@lingui/macro'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useMemo } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName, V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
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

  const distributionLimitCurrency: V2V3CurrencyOption =
    distributionLimitCurrencyRaw === 0n
      ? V2V3_CURRENCY_ETH
      : (Number(distributionLimitCurrencyRaw) as V2V3CurrencyOption) // treat as eth

  const treasuryBalance = (
    <AmountInCurrency
      amount={balanceInDistributionLimitCurrency}
      currency={V2V3CurrencyName(distributionLimitCurrency)}
    />
  )

  const { weiToUsd } = useCurrencyConverter()

  const overflow = useMemo(() => {
    if (isInfiniteDistributionLimit(distributionLimit)) return t`No overflow`

    const overflowInDistributionLimitCurrency =
      distributionLimitCurrency === V2V3_CURRENCY_ETH
        ? primaryTerminalCurrentOverflow
        : parseWad(weiToUsd(primaryTerminalCurrentOverflow))

    return (
      <AmountInCurrency
        amount={overflowInDistributionLimitCurrency}
        currency={V2V3CurrencyName(distributionLimitCurrency)}
      />
    )
  }, [
    primaryTerminalCurrentOverflow,
    distributionLimitCurrency,
    distributionLimit,
    weiToUsd,
  ])

  const availableToPayout = useMemo(() => {
    return (
      <AmountInCurrency
        amount={distributableAmount}
        currency={V2V3CurrencyName(distributionLimitCurrency)}
      />
    )
  }, [distributableAmount, distributionLimitCurrency])
  return {
    treasuryBalance,
    availableToPayout,
    overflow,
    redemptionRate: fundingCycleMetadata?.redemptionRate,
  }
}
