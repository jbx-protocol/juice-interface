import { CurrencyName } from 'constants/currency'
import { Split } from 'models/splits'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3CurrencyName } from 'packages/v2v3/utils/currency'
import { distributionLimitsEqual } from 'packages/v2v3/utils/distributions'
import { isInfiniteDistributionLimit } from 'packages/v2v3/utils/fundingCycle'
import { useContext } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { splitsListsHaveDiff } from 'utils/splits'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

export const usePayoutsSectionValues = () => {
  const {
    distributionLimit: currentDistributionLimit,
    distributionLimitCurrency: currentCurrencyOption,
    fundingCycleMetadata: currentFundingCycleMetadata,
    payoutSplits: currentPayoutSplits,
  } = useContext(V2V3ProjectContext)

  const { editCycleForm } = useEditCycleFormContext()

  const newPayoutSplits: Split[] = editCycleForm?.getFieldValue('payoutSplits')
  const payoutSplitsHasDiff = splitsListsHaveDiff(
    currentPayoutSplits,
    newPayoutSplits,
  )

  const newCurrency: CurrencyName = editCycleForm?.getFieldValue(
    'distributionLimitCurrency',
  )

  let currentCurrency: CurrencyName = 'ETH'
  if (currentCurrencyOption) {
    currentCurrency = V2V3CurrencyName(
      Number(currentCurrencyOption) as V2V3CurrencyOption,
    )!
  }

  const currencyHasDiff = currentCurrency !== newCurrency

  const newDistributionLimitNum =
    editCycleForm?.getFieldValue('distributionLimit')
  const newDistributionLimit =
    newDistributionLimitNum !== undefined
      ? parseWad(newDistributionLimitNum)
      : undefined
  const distributionLimitHasDiff =
    !distributionLimitsEqual(currentDistributionLimit, newDistributionLimit) ||
    currencyHasDiff
  const distributionLimitIsInfinite =
    isInfiniteDistributionLimit(newDistributionLimit)

  const newHoldFees = Boolean(editCycleForm?.getFieldValue('holdFees'))
  const currentHoldFees = Boolean(currentFundingCycleMetadata?.holdFees)
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
