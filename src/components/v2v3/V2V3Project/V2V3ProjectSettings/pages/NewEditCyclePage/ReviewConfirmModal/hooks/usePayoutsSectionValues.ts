import { CurrencyName } from 'constants/currency'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { splitsListsHaveDiff } from 'utils/splits'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { distributionLimitsEqual } from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
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
  const currentCurrency =
    V2V3CurrencyName(currentCurrencyOption?.toNumber() as V2V3CurrencyOption) ??
    'ETH'
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
    !newDistributionLimit || newDistributionLimit.eq(MAX_DISTRIBUTION_LIMIT)

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
