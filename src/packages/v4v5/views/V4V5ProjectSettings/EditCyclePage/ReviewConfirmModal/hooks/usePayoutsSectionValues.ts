import { CurrencyName } from 'constants/currency'
import { JBSplit } from 'juice-sdk-core'
import { distributionLimitsEqual } from 'packages/v4v5/utils/distributions'
import { isInfinitePayoutLimit } from 'packages/v4v5/utils/fundingCycle'
import { MAX_PAYOUT_LIMIT } from 'packages/v4v5/utils/math'
import { splitsListsHaveDiff } from 'packages/v4v5/utils/v4Splits'
import { parseWad } from 'utils/format/formatNumber'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

export const usePayoutsSectionValues = () => {

  const { editCycleForm, initialFormData } = useEditCycleFormContext()

  const newPayoutSplits: JBSplit[] = editCycleForm?.getFieldValue('payoutSplits') ?? []
  const currentPayoutSplits = initialFormData?.payoutSplits ?? []
  const payoutSplitsHasDiff = splitsListsHaveDiff(
    currentPayoutSplits,
    newPayoutSplits,
  )

  const newCurrency: CurrencyName = editCycleForm?.getFieldValue(
    'distributionLimitCurrency',
  ) ?? 'ETH'
  const currentCurrency =
    initialFormData?.payoutLimitCurrency ??
    'ETH'
  const currencyHasDiff = currentCurrency !== newCurrency

  // Raw form field value. For "No limit" the UI leaves the field blank / undefined.
  const rawNewDistributionLimit = editCycleForm?.getFieldValue('payoutLimit')
  const newDistributionLimit: bigint =
    rawNewDistributionLimit === undefined || rawNewDistributionLimit === null || rawNewDistributionLimit === ''
      ? MAX_PAYOUT_LIMIT
      : parseWad(rawNewDistributionLimit).toBigInt()

  const currentDistributionLimitNum = initialFormData?.payoutLimit
  const currentDistributionLimit =
    currentDistributionLimitNum === undefined
      ? MAX_PAYOUT_LIMIT
      : parseWad(currentDistributionLimitNum).toBigInt()

  // A distribution limit diff should only show when either:
  // 1. The numeric (semantic) payout limit changed (taking into account that any infinite value forms are equal)
  // 2. The currency changed
  // NOTE: Previously we flagged a diff when both values were infinite ("No limit" -> "No limit").
  const distributionLimitHasDiff =
    currencyHasDiff ||
    !distributionLimitsEqual(currentDistributionLimit, newDistributionLimit)
  const distributionLimitIsInfinite = isInfinitePayoutLimit(newDistributionLimit)

  const newHoldFees = Boolean(editCycleForm?.getFieldValue('holdFees'))
  const currentHoldFees = Boolean(initialFormData?.holdFees)
  const holdFeesHasDiff = newHoldFees !== currentHoldFees

  const advancedOptionsHasDiff = holdFeesHasDiff
  const sectionHasDiff =
    distributionLimitHasDiff || payoutSplitsHasDiff || advancedOptionsHasDiff

  return {
    newCurrency,
    currentCurrency,

    currentDistributionLimit,
    newDistributionLimit,
    distributionLimitHasDiff,
    distributionLimitIsInfinite,

    currentPayoutSplits,
    newPayoutSplits,
    payoutSplitsHasDiff,

    newHoldFees,
    currentHoldFees,
    holdFeesHasDiff,

    advancedOptionsHasDiff,
    sectionHasDiff,
  }
}
