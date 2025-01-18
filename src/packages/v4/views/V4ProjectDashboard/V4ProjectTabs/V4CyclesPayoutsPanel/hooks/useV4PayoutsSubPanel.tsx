import { JBSplit, SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import { NativeTokenValue, useReadJbMultiTerminalFee } from 'juice-sdk-react'
import { useCallback, useMemo } from 'react'

import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { v4GetProjectOwnerRemainderSplit } from 'packages/v4/utils/v4Splits'
import assert from 'utils/assert'
import { feeForAmount } from 'utils/math'
import { useV4CurrentUpcomingPayoutLimit } from './useV4CurrentUpcomingPayoutLimit'
import { useV4CurrentUpcomingPayoutSplits } from './useV4CurrentUpcomingPayoutSplits'
import { useV4DistributableAmount } from './useV4DistributableAmount'

const splitHasFee = (split: JBSplit) => {
  return split.projectId || split.projectId > 0n
}

const calculateSplitAmountWad = (
  split: JBSplit,
  payoutLimit: bigint | undefined,
  primaryETHTerminalFee: bigint | undefined,
) => {
  const splitValue = payoutLimit
    ? (payoutLimit * split.percent.value) / BigInt(SPLITS_TOTAL_PERCENT)
    : undefined
  const feeAmount = splitHasFee(split)
    ? feeForAmount(splitValue, primaryETHTerminalFee) ?? 0n
    : 0n
  return splitValue ? splitValue - feeAmount : undefined
}

export const useV4PayoutsSubPanel = (type: 'current' | 'upcoming') => {
  const { splits, isLoading } = useV4CurrentUpcomingPayoutSplits(type)
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()
  const { data: primaryNativeTerminalFee } = useReadJbMultiTerminalFee()
  const { distributableAmount } = useV4DistributableAmount()

  const { payoutLimit, payoutLimitCurrency } =
    useV4CurrentUpcomingPayoutLimit(type)
  const showAmountOnPayout =
    payoutLimit !== MAX_PAYOUT_LIMIT && payoutLimit !== 0n

  const transformSplit = useCallback(
    (split: JBSplit) => {
      assert(split.beneficiary, 'Beneficiary must be defined')
      let amount = undefined
      const splitAmountWad = calculateSplitAmountWad(
        split,
        payoutLimit,
        primaryNativeTerminalFee,
      )
      if (showAmountOnPayout && splitAmountWad && payoutLimitCurrency) {
        amount = <NativeTokenValue wei={splitAmountWad} />
      }
      return {
        projectId: split.projectId ? Number(split.projectId) : undefined,
        address: split.beneficiary!,
        percent: `${split.percent.formatPercentage()}%`,
        amount,
      }
    },
    [
      payoutLimit,
      payoutLimitCurrency,
      showAmountOnPayout,
      primaryNativeTerminalFee,
    ],
  )

  const totalPayoutAmount = useMemo(() => {
    if (!payoutLimit || !payoutLimitCurrency) return
    if (payoutLimit === MAX_PAYOUT_LIMIT || payoutLimit === 0n) return

    return <NativeTokenValue wei={payoutLimit} />
  }, [payoutLimit, payoutLimitCurrency])

  const payouts = useMemo(() => {
    if (isLoading || !splits) return

    if (
      // We don't need to worry about upcoming as this is informational only
      type === 'current' &&
      splits.length === 0 &&
      payoutLimit === 0n &&
      distributableAmount.value === 0n
    ) {
      return []
    }

    const ownerPayout = projectOwnerAddress
      ? v4GetProjectOwnerRemainderSplit(projectOwnerAddress, splits)
      : undefined

    return [
      ...splits,
      ...(ownerPayout && ownerPayout.percent.value > 0n ? [ownerPayout] : []),
    ]
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(transformSplit)
  }, [
    distributableAmount,
    projectOwnerAddress,
    splits,
    isLoading,
    payoutLimit,
    transformSplit,
    type,
  ])

  return {
    isLoading,
    payouts,
    totalPayoutAmount,
    payoutLimit,
  }
}
