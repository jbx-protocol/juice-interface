import { BigNumber } from '@ethersproject/bignumber'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { Split } from 'packages/v2v3/models/splits'
import { V2V3CurrencyName } from 'packages/v2v3/utils/currency'
import { isJuiceboxProjectSplit } from 'packages/v2v3/utils/distributions'
import {
  MAX_DISTRIBUTION_LIMIT,
  SPLITS_TOTAL_PERCENT,
  formatSplitPercent,
} from 'packages/v2v3/utils/math'
import { getProjectOwnerRemainderSplit } from 'packages/v2v3/utils/v2v3Splits'
import { useCallback, useMemo } from 'react'
import assert from 'utils/assert'
import { feeForAmount } from 'utils/math'
import { useCurrentUpcomingDistributionLimit } from './useCurrentUpcomingDistributionLimit'
import { useCurrentUpcomingPayoutSplits } from './useCurrentUpcomingPayoutSplits'
import { useDistributableAmount } from './useDistributableAmount'

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
    ? feeForAmount(splitValue?.toBigInt(), primaryETHTerminalFee?.toBigInt()) ??
      0n
    : BigNumber.from(0)
  return splitValue?.sub(feeAmount)
}

export const usePayoutsSubPanel = (type: 'current' | 'upcoming') => {
  const { splits, loading } = useCurrentUpcomingPayoutSplits(type)
  const { projectOwnerAddress, primaryETHTerminalFee } = useProjectContext()
  const { distributableAmount } = useDistributableAmount()

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
        amount = (
          <AmountInCurrency
            amount={splitAmountWad}
            currency={V2V3CurrencyName(
              distributionLimitCurrency.toNumber() as V2V3CurrencyOption,
            )}
          />
        )
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

    return (
      <AmountInCurrency
        amount={distributionLimit}
        currency={V2V3CurrencyName(
          distributionLimitCurrency.toNumber() as V2V3CurrencyOption,
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
      distributableAmount.eq(0)
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
