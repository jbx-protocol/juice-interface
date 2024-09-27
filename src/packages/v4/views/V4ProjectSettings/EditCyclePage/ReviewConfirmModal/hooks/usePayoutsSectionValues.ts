import { CurrencyName } from 'constants/currency'
import { JBSplit } from 'juice-sdk-core'
import { distributionLimitsEqual } from 'packages/v4/utils/distributions'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { splitsListsHaveDiff } from 'packages/v4/utils/v4Splits'
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

  const newDistributionLimitNum: number = editCycleForm?.getFieldValue('payoutLimit')
  const newDistributionLimit =
    newDistributionLimitNum ? parseWad(newDistributionLimitNum).toBigInt() : MAX_PAYOUT_LIMIT
  
  const currentDistributionLimitNum = initialFormData?.payoutLimit
  const currentDistributionLimit = currentDistributionLimitNum ? parseWad(currentDistributionLimitNum).toBigInt() : MAX_PAYOUT_LIMIT

  const distributionLimitHasDiff =
    !distributionLimitsEqual(currentDistributionLimit, newDistributionLimit) ||
    currencyHasDiff
    // TODO: When no limit is set and doesnt change, distributionLimitHasDiff still true
  const distributionLimitIsInfinite =
    !newDistributionLimit || newDistributionLimit === MAX_PAYOUT_LIMIT

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
