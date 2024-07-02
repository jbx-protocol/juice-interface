import { t } from '@lingui/macro'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import {
  V2V3CurrencyName,
  V2V3_CURRENCY_ETH,
} from 'packages/v2v3/utils/currency'
import { isInfiniteDistributionLimit } from 'packages/v2v3/utils/fundingCycle'
import { useMemo } from 'react'
import { parseWad } from 'utils/format/formatNumber'
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
