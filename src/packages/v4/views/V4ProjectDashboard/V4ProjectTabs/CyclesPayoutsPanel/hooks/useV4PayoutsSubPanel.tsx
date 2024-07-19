import { NativeTokenValue, useReadJbMultiTerminalFee } from 'juice-sdk-react'

import useProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { V4Split } from 'packages/v4/models/v4Split'
import { formatV4SplitPercent, MAX_PAYOUT_LIMIT, V4_SPLITS_TOTAL_PERCENT } from 'packages/v4/utils/math'
import { v4GetProjectOwnerRemainderSplit } from 'packages/v4/utils/v4Splits'
import { useCallback, useMemo } from 'react'
import assert from 'utils/assert'
import { feeForAmount } from 'utils/math'
import { useV4CurrentUpcomingPayoutLimit } from './useV4CurrentUpcomingPayoutLimit'
import { useV4CurrentUpcomingPayoutSplits } from './useV4CurrentUpcomingPayoutSplits'
import { useV4DistributableAmount } from './useV4DistributableAmount'

const splitHasFee = (split: V4Split) => {
  return split.projectId || split.projectId > 0n
}

const calculateSplitAmountWad = (
  split: V4Split,
  payoutLimit: bigint | undefined,
  primaryETHTerminalFee: bigint | undefined,
) => {
  const splitValue = payoutLimit ?
    (payoutLimit * split.percent / V4_SPLITS_TOTAL_PERCENT) : undefined
  const feeAmount = splitHasFee(split)
    ? feeForAmount(splitValue, primaryETHTerminalFee) ?? 0n
    : 0n
  return splitValue ? splitValue - feeAmount : undefined
}

export const useV4PayoutsSubPanel = (type: 'current' | 'upcoming') => {
  const { splits, isLoading } = useV4CurrentUpcomingPayoutSplits(type)

  const { data: projectOwnerAddress } = useProjectOwnerOf()

  const { data: primaryNativeTerminalFee } = useReadJbMultiTerminalFee()

  const { distributableAmount } = useV4DistributableAmount()

  const { payoutLimit, payoutLimitCurrency } =
    useV4CurrentUpcomingPayoutLimit(type)

  const showAmountOnPayout = useMemo(() => {
    return (payoutLimit === MAX_PAYOUT_LIMIT || payoutLimit === 0n)
  }, [payoutLimit])

  const transformSplit = useCallback(
    (split: V4Split) => {
      assert(split.beneficiary, 'Beneficiary must be defined')
      let amount = undefined
      const splitAmountWad = calculateSplitAmountWad(
        split,
        payoutLimit,
        primaryNativeTerminalFee,
      )
      if (showAmountOnPayout && splitAmountWad && payoutLimitCurrency) {
        amount = (
          <NativeTokenValue
            wei={splitAmountWad}
          />
        )
      }
      return {
        projectId: split.projectId
          ? Number(split.projectId)
          : undefined,
        address: split.beneficiary!,
        percent: `${formatV4SplitPercent(split.percent)}%`,
        amount,
      }
    },
    [
      payoutLimit,
      payoutLimitCurrency,
      showAmountOnPayout,
      primaryNativeTerminalFee
    ],
  )

  const totalPayoutAmount = useMemo(() => {
    if (!payoutLimit || !payoutLimitCurrency) return
    if (
      payoutLimit === MAX_PAYOUT_LIMIT ||
      payoutLimit === 0n
    )
      return

    return (
      <NativeTokenValue wei={payoutLimit} />
    )
  }, [payoutLimit, payoutLimitCurrency])

  const payouts = useMemo(() => {
    if (isLoading || !splits) return

    if (
      // We don't need to worry about upcoming as this is informational only
      type === 'current' &&
      splits.length === 0 &&
      payoutLimit === 0n &&
      distributableAmount === 0n
    ) {
      return []
    }

    const ownerPayout = projectOwnerAddress
      ? v4GetProjectOwnerRemainderSplit(projectOwnerAddress, splits)
      : undefined

    return [
      ...splits,
      ...(ownerPayout && ownerPayout.percent > 0 ? [ownerPayout] : []),
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
    payoutLimit
  }
}
