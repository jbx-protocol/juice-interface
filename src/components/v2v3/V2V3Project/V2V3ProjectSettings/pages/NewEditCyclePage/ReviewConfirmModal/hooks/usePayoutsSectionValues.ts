import { CurrencyName } from 'constants/currency'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName, V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

export const usePayoutsSectionValues = () => {
  const { editCycleForm } = useEditCycleFormContext()

  const {
    distributionLimit: currentDistributionLimit,
    distributionLimitCurrency: currentCurrencyOption,
    fundingCycleMetadata: currentFundingCycleMetadata,
    payoutSplits: currentPayoutSplits,
  } = useContext(V2V3ProjectContext)

  const newPayoutSplits: Split[] = editCycleForm?.getFieldValue('payoutSplits')

  const newCurrency: CurrencyName = editCycleForm?.getFieldValue(
    'distributionLimitCurrency',
  )
  const currentCurrency = V2V3CurrencyName(
    (currentCurrencyOption?.toNumber() ??
      V2V3_CURRENCY_ETH) as V2V3CurrencyOption,
  )
  const currencyHasDiff = currentCurrency !== newCurrency

  const newDistributionLimit = parseWad(
    editCycleForm?.getFieldValue('distributionLimit') as number,
  )
  const distributionLimitHasDiff =
    (currentDistributionLimit &&
      !newDistributionLimit?.eq(currentDistributionLimit)) ||
    currencyHasDiff
  const distributionLimitIsInfinite =
    !newDistributionLimit || newDistributionLimit.eq(MAX_DISTRIBUTION_LIMIT)

  const newHoldFees = Boolean(editCycleForm?.getFieldValue('holdFees'))
  const currentHoldFees = Boolean(currentFundingCycleMetadata?.holdFees)
  const holdFeesHasDiff = newHoldFees !== currentHoldFees

  const advancedOptionsHasDiff = holdFeesHasDiff
  const sectionHasDiff = distributionLimitHasDiff || advancedOptionsHasDiff // TODO: || payoutSplitsHasDiff

  return {
    newCurrency,
    currentCurrency,

    currentDistributionLimit,
    newDistributionLimit,
    distributionLimitHasDiff,
    distributionLimitIsInfinite,

    currentPayoutSplits,
    newPayoutSplits,
    // TODO: payoutSplitsHasDiff,

    newHoldFees,
    currentHoldFees,
    holdFeesHasDiff,

    advancedOptionsHasDiff,
    sectionHasDiff,
  }
}
