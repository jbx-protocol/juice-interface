import { BigNumber } from '@ethersproject/bignumber'
import { Form } from 'antd'
import { DefaultSettings as DefaultTokenSettings } from 'components/Create/components/pages/ProjectToken/hooks/useProjectTokenForm'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useEffect, useState } from 'react'
import {
  deriveDurationOption,
  deriveDurationUnit,
  secondsToOtherUnit,
} from 'utils/format/formatTime'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { distributionLimitStringtoNumber } from 'utils/v2v3/distributions'
import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2v3/math'
import { useInitialEditingData } from '../../ReconfigureFundingCycleSettingsPage/hooks/useInitialEditingData'
import { EditCycleFormFields } from '../EditCycleFormFields'

/** Loads project FC data from redux into an Ant D form instance */
export const useLoadEditCycleData = () => {
  const [initialFormData, setInitialFormData] = useState<
    EditCycleFormFields | undefined
  >(undefined)
  const { initialEditingData } = useInitialEditingData({ visible: true })
  const [editCycleForm] = Form.useForm<EditCycleFormFields>()

  useEffect(() => {
    // Extracts EditCycleFormFields from initialEditingData (which comes from redux)
    if (initialEditingData) {
      const duration = BigNumber.from(
        initialEditingData.fundingCycleData.duration,
      ).toNumber()
      const fundingCycleData = initialEditingData.fundingCycleData
      const fundingCycleMetadata = initialEditingData.fundingCycleMetadata
      const mintRate = fundingCycleData?.weight
        ? parseFloat(formatIssuanceRate(fundingCycleData.weight))
        : parseFloat(DefaultTokenSettings.initialMintRate)
      const reservedTokens = fundingCycleMetadata.reservedRate
        ? parseFloat(formatReservedRate(fundingCycleMetadata.reservedRate))
        : DefaultTokenSettings.reservedTokensPercentage
      const reservedSplits =
        initialEditingData.payoutGroupedSplits.reservedTokensGroupedSplits
      const discountRate = fundingCycleData.discountRate
        ? parseFloat(formatDiscountRate(fundingCycleData.discountRate))
        : DefaultTokenSettings.discountRate
      const redemptionRate = fundingCycleMetadata.redemptionRate
        ? parseFloat(formatRedemptionRate(fundingCycleMetadata.redemptionRate))
        : DefaultTokenSettings.redemptionRate
      const allowTokenMinting =
        fundingCycleMetadata.allowMinting !== undefined
          ? fundingCycleMetadata.allowMinting
          : DefaultTokenSettings.tokenMinting
      const pauseTransfers =
        fundingCycleMetadata.global.pauseTransfers !== undefined
          ? fundingCycleMetadata.global.pauseTransfers
          : DefaultTokenSettings.pauseTransfers

      const formData = {
        duration: secondsToOtherUnit({
          duration,
          unit: deriveDurationUnit(duration),
        }),
        durationUnit: deriveDurationOption(duration),
        ballot: initialEditingData.fundingCycleData.ballot,
        allowSetTerminals:
          initialEditingData.fundingCycleMetadata.global.allowSetTerminals,
        allowSetController:
          initialEditingData.fundingCycleMetadata.global.allowSetController,
        pausePay: initialEditingData.fundingCycleMetadata.pausePay,
        payoutSplits:
          initialEditingData.payoutGroupedSplits.payoutGroupedSplits,
        distributionLimit: distributionLimitStringtoNumber(
          initialEditingData.fundAccessConstraints[0]?.distributionLimit,
        ),
        distributionLimitCurrency:
          V2V3CurrencyName(
            BigNumber.from(
              initialEditingData.fundAccessConstraints[0]
                ?.distributionLimitCurrency ?? 0,
            ).toNumber() as V2V3CurrencyOption,
          ) ?? 'ETH',
        holdFees: initialEditingData.fundingCycleMetadata.holdFees,
        mintRate,
        reservedTokens,
        reservedSplits,
        discountRate,
        redemptionRate,
        allowTokenMinting,
        pauseTransfers: pauseTransfers,
        nftRewards: initialEditingData.nftRewards,
        useDataSourceForRedeem:
          initialEditingData.fundingCycleMetadata.useDataSourceForRedeem,
        memo: '',
      }

      setInitialFormData(formData)
      editCycleForm.setFieldsValue(formData)
    }
  }, [initialEditingData, editCycleForm])
  return {
    initialFormData,
    editCycleForm,
  }
}
