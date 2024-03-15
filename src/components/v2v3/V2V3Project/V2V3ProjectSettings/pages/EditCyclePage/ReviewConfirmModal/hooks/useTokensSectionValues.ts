import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { splitsListsHaveDiff } from 'utils/splits'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  deriveNextIssuanceRate,
  getUnsafeV2V3FundingCycleProperties,
} from 'utils/v2v3/fundingCycle'
import {
  discountRateFrom,
  issuanceRateFrom,
  reservedRateFrom,
} from 'utils/v2v3/math'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

export const useTokensSectionValues = () => {
  const {
    tokenSymbol,
    fundingCycle: currentFundingCycle,
    fundingCycleMetadata: currentFundingCycleMetadata,
    reservedTokensSplits: currentReservedSplits,
  } = useContext(V2V3ProjectContext)
  const { editCycleForm } = useEditCycleFormContext()

  const formValues = editCycleForm?.getFieldsValue(true)

  const unsafeFundingCycleProperties =
    currentFundingCycle && currentFundingCycleMetadata
      ? getUnsafeV2V3FundingCycleProperties(
          currentFundingCycle,
          currentFundingCycleMetadata,
        )
      : undefined

  const tokenSymbolPlural = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })
  const newMintRateNum = parseFloat(formValues.mintRate ?? '0')
  const newMintRate = BigNumber.from(
    issuanceRateFrom(newMintRateNum.toString()),
  )

  const newReservedRate = reservedRateFrom(formValues.reservedTokens)
  const newReservedSplits = formValues.reservedSplits
  const newDiscountRate = discountRateFrom(formValues.discountRate)
  const newRedemptionRate = reservedRateFrom(formValues.redemptionRate)
  const newAllowMinting = formValues.allowTokenMinting
  const newPauseTransfers = formValues.pauseTransfers

  const currentMintRate = currentFundingCycle?.weight

  const currentReservedRate = currentFundingCycleMetadata?.reservedRate
  const currentDiscountRate = currentFundingCycle?.discountRate
  const currentRedemptionRate = currentFundingCycleMetadata?.redemptionRate
  const currentAllowMinting = Boolean(currentFundingCycleMetadata?.allowMinting)
  const currentPauseTransfers = Boolean(
    currentFundingCycleMetadata?.global.pauseTransfers,
  )

  const onlyDiscountRateApplied =
    currentFundingCycle &&
    newMintRate &&
    newMintRate.eq(
      deriveNextIssuanceRate({
        weight: BigNumber.from(0),
        previousFC: currentFundingCycle,
      }),
    )

  const mintRateHasDiff = !onlyDiscountRateApplied

  const reservedRateHasDiff = Boolean(
    currentReservedRate &&
      !BigNumber.from(newReservedRate).eq(currentReservedRate),
  )

  const reservedSplitsHasDiff = splitsListsHaveDiff(
    currentReservedSplits,
    newReservedSplits,
  )

  const discountRateHasDiff = Boolean(
    currentDiscountRate &&
      !BigNumber.from(newDiscountRate).eq(currentDiscountRate),
  )

  const redemptionHasDiff =
    currentRedemptionRate &&
    !BigNumber.from(newRedemptionRate).eq(currentRedemptionRate)

  const allowMintingHasDiff = Boolean(newAllowMinting !== currentAllowMinting)

  const pauseTransfersHasDiff = Boolean(
    newPauseTransfers !== currentPauseTransfers,
  )

  const advancedOptionsHasDiff =
    reservedRateHasDiff ||
    discountRateHasDiff ||
    redemptionHasDiff ||
    allowMintingHasDiff ||
    pauseTransfersHasDiff

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

    newPauseTransfers,
    currentPauseTransfers,
    pauseTransfersHasDiff,

    tokenSymbolPlural,
    unsafeFundingCycleProperties,

    advancedOptionsHasDiff,
    sectionHasDiff,
  }
}
