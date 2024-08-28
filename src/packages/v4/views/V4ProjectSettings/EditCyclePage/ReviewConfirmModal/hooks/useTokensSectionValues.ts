import { useJBTokenContext } from 'juice-sdk-react'
import round from 'lodash/round'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { splitsListsHaveDiff } from 'packages/v4/utils/v4Splits'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useEditCycleFormContext } from '../../EditCycleFormContext'
import { EditCycleFormFields } from '../../EditCycleFormFields'

export const useTokensSectionValues = () => {
  const { editCycleForm, initialFormData } = useEditCycleFormContext()

  const formValues: EditCycleFormFields = editCycleForm?.getFieldsValue(true)

  const { 
    ruleset: upcomingRuleset, 
  } = useJBUpcomingRuleset()

  const { token } = useJBTokenContext()
  const tokenSymbol = token?.data?.symbol

  const tokenSymbolPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })
  const newMintRate = formValues.issuanceRate

  const newReservedRate = formValues.reservedPercent
  const newReservedSplits = formValues.reservedTokensSplits
  const newDiscountRate = formValues.decayPercent
  const newRedemptionRate = formValues.redemptionRate
  const newAllowMinting = formValues.allowOwnerMinting
  const newTokenTransfers = formValues.tokenTransfers

  const currentMintRate = initialFormData?.issuanceRate
  const currentReservedRate = initialFormData?.reservedPercent
  const currentReservedSplits = initialFormData?.reservedTokensSplits
  const currentDiscountRate = initialFormData?.decayPercent
  const currentRedemptionRate = initialFormData?.redemptionRate
  const currentAllowMinting = Boolean(initialFormData?.allowOwnerMinting)
  const currentTokenTransfers = Boolean(
    initialFormData?.tokenTransfers,
  )

  const onlyDiscountRateApplied =
    upcomingRuleset &&
    newMintRate &&
    round(upcomingRuleset?.weight.toFloat(), 4) === round(newMintRate, 4)

  const mintRateHasDiff = !onlyDiscountRateApplied

  const reservedRateHasDiff = Boolean(
    currentReservedRate &&
      newReservedRate !== currentReservedRate,
  )

  const reservedSplitsHasDiff = splitsListsHaveDiff(
    currentReservedSplits,
    newReservedSplits,
  )

  const discountRateHasDiff = Boolean(
    currentDiscountRate &&
      newDiscountRate !== currentDiscountRate,
  )

  const redemptionHasDiff =
    currentRedemptionRate &&
    newRedemptionRate !== currentRedemptionRate

  const allowMintingHasDiff = Boolean(newAllowMinting !== currentAllowMinting)

  const tokenTransfersHasDiff = Boolean(
    newTokenTransfers !== currentTokenTransfers,
  )

  const advancedOptionsHasDiff =
    reservedRateHasDiff ||
    discountRateHasDiff ||
    redemptionHasDiff ||
    allowMintingHasDiff ||
    tokenTransfersHasDiff

  const sectionHasDiff =
    mintRateHasDiff || reservedSplitsHasDiff || advancedOptionsHasDiff

  return {
    newMintRate,
    currentMintRate,
    mintRateHasDiff,

    newReservedRate,
    currentReservedRate,
    reservedRateHasDiff,

    newReservedSplits,
    currentReservedSplits,
    reservedSplitsHasDiff,

    newDiscountRate,
    currentDiscountRate,
    discountRateHasDiff,

    newRedemptionRate,
    currentRedemptionRate,
    redemptionHasDiff,

    newAllowMinting,
    currentAllowMinting,
    allowMintingHasDiff,

    newTokenTransfers,
    currentTokenTransfers,
    tokenTransfersHasDiff,

    tokenSymbolPlural,
    // unsafeFundingCycleProperties,

    advancedOptionsHasDiff,
    sectionHasDiff,
  }
}
