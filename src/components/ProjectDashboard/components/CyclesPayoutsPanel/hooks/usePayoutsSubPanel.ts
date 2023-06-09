import { t } from '@lingui/macro'
import assert from 'assert'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { BigNumber } from 'ethers'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useMemo } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'
import {
  MAX_DISTRIBUTION_LIMIT,
  SPLITS_TOTAL_PERCENT,
  feeForAmount,
  formatSplitPercent,
} from 'utils/v2v3/math'

export const usePayoutsSubPanel = () => {
  const {
    payoutSplits,
    distributionLimit,
    distributionLimitCurrency,
    primaryETHTerminalFee,
    balanceInDistributionLimitCurrency,
    usedDistributionLimit,
  } = useProjectContext()

  const showAmountOnPayout = useMemo(() => {
    if (distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)) return false
    if (distributionLimit?.eq(0)) return false
    return true
  }, [distributionLimit])

  const splitHasFee = useCallback((split: Split) => {
    return !isJuiceboxProjectSplit(split)
  }, [])

  const calculateSplitAmountWad = useCallback(
    (split: Split) => {
      const splitValue = distributionLimit
        ?.mul(split.percent)
        .div(SPLITS_TOTAL_PERCENT)
      const feeAmount = splitHasFee(split)
        ? feeForAmount(splitValue, primaryETHTerminalFee) ?? BigNumber.from(0)
        : BigNumber.from(0)
      return splitValue?.sub(feeAmount)
    },
    [distributionLimit, primaryETHTerminalFee, splitHasFee],
  )

  const transformSplit = useCallback(
    (split: Split) => {
      assert(split.beneficiary, 'Beneficiary must be defined')
      let amount = undefined
      const splitAmountWad = calculateSplitAmountWad(split)
      if (showAmountOnPayout && splitAmountWad && distributionLimitCurrency) {
        amount = formatCurrencyAmount({
          amount: Number(fromWad(splitAmountWad)),
          currency: distributionLimitCurrency.toNumber() as V2V3CurrencyOption,
        })
      }
      return {
        projectId: split.projectId
          ? BigNumber.from(split.projectId).toNumber()
          : undefined,
        address: split.beneficiary!,
        percent: `${formatSplitPercent(BigNumber.from(split.percent))}%`,
        amount,
      }
    },
    [calculateSplitAmountWad, distributionLimitCurrency, showAmountOnPayout],
  )

  const payouts = useMemo(() => {
    if (!payoutSplits) return undefined
    return payoutSplits
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(transformSplit)
  }, [payoutSplits, transformSplit])

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
    if (!usedDistributionLimit || !balanceInDistributionLimitCurrency)
      return undefined
    const availableToPayoutWad = usedDistributionLimit.gt(
      balanceInDistributionLimitCurrency,
    )
      ? balanceInDistributionLimitCurrency
      : usedDistributionLimit

    return formatCurrencyAmount({
      amount: Number(fromWad(availableToPayoutWad)),
      currency: distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
    })
  }, [
    balanceInDistributionLimitCurrency,
    distributionLimitCurrency,
    usedDistributionLimit,
  ])

  return {
    payouts,
    treasuryBalance,
    availableToPayout,
    overflow,
  }
}
