import { JBSplit, SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import { useCallback, useMemo } from 'react'
import { useJBChainId, useJBContractContext, useReadJbMultiTerminalFee } from 'juice-sdk-react'

import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { BigNumber } from 'ethers'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { V4CurrencyName } from 'packages/v4/utils/currency'
import { V4CurrencyOption } from 'packages/v4/models/v4CurrencyOption'
import assert from 'utils/assert'
import { feeForAmount } from 'utils/math'
import { useV4CurrentUpcomingPayoutLimit } from './useV4CurrentUpcomingPayoutLimit'
import { useV4CurrentUpcomingPayoutSplits } from './useV4CurrentUpcomingPayoutSplits'
import { useV4DistributableAmount } from './useV4DistributableAmount'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { v4GetProjectOwnerRemainderSplit } from 'packages/v4/utils/v4Splits'

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

  const { projectId } = useJBContractContext()  
  const chainId = useJBChainId()
  const { distributableAmount } = useV4DistributableAmount({ chainId, projectId })

  const { payoutLimit, payoutLimitCurrency } =
    useV4CurrentUpcomingPayoutLimit(type)

  const payoutLimitCurrencyName = V4CurrencyName(
    payoutLimitCurrency as V4CurrencyOption,
  )

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
        amount = <AmountInCurrency
        amount={BigNumber.from(splitAmountWad)}
        currency={payoutLimitCurrencyName}
      />
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
      payoutLimitCurrencyName,
      showAmountOnPayout,
      primaryNativeTerminalFee,
    ],
  )

  const totalPayoutAmount = useMemo(() => {
    if (!payoutLimit || !payoutLimitCurrency) return
    if (payoutLimit === MAX_PAYOUT_LIMIT || payoutLimit === 0n) return

    return <AmountInCurrency
            amount={BigNumber.from(payoutLimit)}
            currency={payoutLimitCurrencyName}
          />
  }, [payoutLimit, payoutLimitCurrency, payoutLimitCurrencyName])

  const payouts = useMemo(() => {
    if (isLoading || !splits) return

    if (
      // We don't need to worry about upcoming as this is informational only
      type === 'current' &&
      splits.length === 0 &&
      payoutLimit === 0n
      && distributableAmount.value === 0n
    ) {
      return []
    }

    const ownerPayout = projectOwnerAddress
      ? v4GetProjectOwnerRemainderSplit(projectOwnerAddress as `0x${string}`, splits)
      : undefined

    return [
      ...splits,
      ...(ownerPayout && ownerPayout.percent.value > 0n ? [ownerPayout] : []),
    ]
      .sort((a, b) => Number(b.percent) - Number(a.percent))
      .map(transformSplit)
  }, [
    projectOwnerAddress,
    splits,
    isLoading,
    payoutLimit,
    transformSplit,
    type,
    distributableAmount.value
  ])

  return {
    isLoading,
    payouts,
    totalPayoutAmount,
    payoutLimit,
  }
}
