import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useMemo } from 'react'
import assert from 'utils/assert'
import { getProjectOwnerRemainderSplit } from 'utils/splits'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'
import {
  SPLITS_TOTAL_PERCENT,
  feeForAmount,
  formatSplitPercent,
} from 'utils/v2v3/math'
import { useCurrentUpcomingDistributionLimit } from './useCurrentUpcomingDistributionLimit'
import { useCurrentUpcomingPayoutSplits } from './useCurrentUpcomingPayoutSplits'
import { useDistributableAmount } from './useDistributableAmount'

const splitHasFee = (split: Split) => {
  return !isJuiceboxProjectSplit(split)
}

const calculateSplitAmountWad = (
  split: Split,
  distributionLimit: bigint | undefined,
  primaryETHTerminalFee: bigint | undefined,
) => {
  const splitValue = distributionLimit
    ? (distributionLimit * BigInt(split.percent)) / SPLITS_TOTAL_PERCENT
    : undefined
  const feeAmount = splitHasFee(split)
    ? feeForAmount(splitValue, primaryETHTerminalFee) ?? BigInt(0)
    : BigInt(0)
  return splitValue ? splitValue - feeAmount : undefined
}

export const usePayoutsSubPanel = (type: 'current' | 'upcoming') => {
  const { splits, loading } = useCurrentUpcomingPayoutSplits(type)
  const { projectOwnerAddress, primaryETHTerminalFee } = useProjectContext()
  const { distributableAmount } = useDistributableAmount()

  const { distributionLimit, distributionLimitCurrency } =
    useCurrentUpcomingDistributionLimit(type)

  const showAmountOnPayout =
    distributionLimit === 0n || isInfiniteDistributionLimit(distributionLimit)
      ? false
      : true

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
        amount = (
          <AmountInCurrency
            amount={splitAmountWad}
            currency={V2V3CurrencyName(
              Number(distributionLimitCurrency) as V2V3CurrencyOption,
            )}
          />
        )
      }
      return {
        projectId: split.projectId
          ? Number(BigInt(split.projectId))
          : undefined,
        address: split.beneficiary!,
        percent: `${formatSplitPercent(BigInt(split.percent))}%`,
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
      isInfiniteDistributionLimit(distributionLimit) ||
      distributionLimit === 0n
    )
      return

    return (
      <AmountInCurrency
        amount={distributionLimit}
        currency={V2V3CurrencyName(
          Number(distributionLimitCurrency) as V2V3CurrencyOption,
        )}
      />
    )
  }, [distributionLimit, distributionLimitCurrency])

  const payouts = useMemo(() => {
    if (loading || !splits) return

    if (
      // We don't need to worry about upcoming as this is informational only
      type === 'current' &&
      splits.length === 0 &&
      distributableAmount === 0n
    ) {
      return []
    }

    const ownerPayout = projectOwnerAddress
      ? getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
      : undefined

    return [
      ...splits,
      ...(ownerPayout && ownerPayout.percent > 0 ? [ownerPayout] : []),
    ]
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(transformSplit)
  }, [
    distributableAmount,
    loading,
    projectOwnerAddress,
    splits,
    transformSplit,
    type,
  ])

  return {
    loading,
    payouts,
    totalPayoutAmount,
    distributionLimit,
  }
}
