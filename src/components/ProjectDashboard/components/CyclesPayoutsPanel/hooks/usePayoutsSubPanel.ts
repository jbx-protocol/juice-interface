import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { BigNumber } from 'ethers'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useMemo } from 'react'
import assert from 'utils/assert'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { getProjectOwnerRemainderSplit } from 'utils/splits'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import {
  MAX_DISTRIBUTION_LIMIT,
  SPLITS_TOTAL_PERCENT,
  feeForAmount,
  formatSplitPercent,
} from 'utils/v2v3/math'
import { useCurrentUpcomingDistributionLimit } from './useCurrentUpcomingDistributionLimit'
import { useCurrentUpcomingPayoutSplits } from './useCurrentUpcomingPayoutSplits'

const splitHasFee = (split: Split) => {
  return !isJuiceboxProjectSplit(split)
}

const calculateSplitAmountWad = (
  split: Split,
  distributionLimit: BigNumber | undefined,
  primaryETHTerminalFee: BigNumber | undefined,
) => {
  const splitValue = distributionLimit
    ?.mul(split.percent)
    .div(SPLITS_TOTAL_PERCENT)
  const feeAmount = splitHasFee(split)
    ? feeForAmount(splitValue, primaryETHTerminalFee) ?? BigNumber.from(0)
    : BigNumber.from(0)
  return splitValue?.sub(feeAmount)
}

export const usePayoutsSubPanel = (type: 'current' | 'upcoming') => {
  const { splits, loading } = useCurrentUpcomingPayoutSplits(type)
  const { projectOwnerAddress, primaryETHTerminalFee } = useProjectContext()

  const { distributionLimit, distributionLimitCurrency } =
    useCurrentUpcomingDistributionLimit(type)

  const showAmountOnPayout = useMemo(() => {
    if (distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)) return false
    if (distributionLimit?.eq(0)) return false
    return true
  }, [distributionLimit])

  const transformSplit = useCallback(
    (split: Split) => {
      assert(split.beneficiary, 'Beneficiary must be defined')
      let amount = undefined
      const splitAmountWad = calculateSplitAmountWad(
        split,
        distributionLimit,
        primaryETHTerminalFee,
      )
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
    [
      distributionLimit,
      distributionLimitCurrency,
      primaryETHTerminalFee,
      showAmountOnPayout,
    ],
  )

  const totalPayoutAmount = useMemo(() => {
    if (!distributionLimit || !distributionLimitCurrency) return
    if (
      distributionLimit.eq(MAX_DISTRIBUTION_LIMIT) ||
      distributionLimit.isZero()
    )
      return
    return formatCurrencyAmount({
      amount: fromWad(distributionLimit),
      currency: distributionLimitCurrency.toNumber() as V2V3CurrencyOption,
    })
  }, [distributionLimit, distributionLimitCurrency])

  const payouts = useMemo(() => {
    if (loading || !splits) return

    const ownerPayout = projectOwnerAddress
      ? getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
      : undefined

    return [
      ...splits,
      ...(ownerPayout && ownerPayout.percent > 0 ? [ownerPayout] : []),
    ]
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(transformSplit)
  }, [loading, projectOwnerAddress, splits, transformSplit])

  return {
    loading,
    payouts,
    totalPayoutAmount,
  }
}
