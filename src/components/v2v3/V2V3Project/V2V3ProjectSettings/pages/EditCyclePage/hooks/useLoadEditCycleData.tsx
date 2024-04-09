import { BigNumber } from '@ethersproject/bignumber'
import { Form } from 'antd'
import { DefaultSettings as DefaultTokenSettings } from 'components/Create/components/pages/ProjectToken/hooks/useProjectTokenForm'
import isEqual from 'lodash/isEqual'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useEffect, useRef, useState } from 'react'
import {
  deriveDurationOption,
  deriveDurationUnit,
  secondsToOtherUnit,
} from 'utils/format/formatTime'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { distributionLimitStringtoNumber } from 'utils/v2v3/distributions'
import { deriveNextIssuanceRate } from 'utils/v2v3/fundingCycle'
import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'utils/v2v3/math'
import { deserializeV2V3FundingCycleData } from 'utils/v2v3/serializers'
import { useInitialEditingData } from '../../../hooks/useInitialEditingData'
import { EditCycleFormFields } from '../EditCycleFormFields'

/** Loads project FC data from redux into an Ant D form instance */
export const useLoadEditCycleData = () => {
  const [initialFormData, setInitialFormData] = useState<
    EditCycleFormFields | undefined
  >(undefined)
  // Project's current FC, metadata, fund access constraint, etc.
  const { initialEditingData: currentProjectData } = useInitialEditingData({
    visible: true,
  })
  const [editCycleForm] = Form.useForm<EditCycleFormFields>()

  const initialEditingData = useRef(currentProjectData)

  // Extracts EditCycleFormFields from initialEditingData (which comes from redux)
  useEffect(() => {
    // Ensure set formValues if currentProjectData has changed (currentProjectData !== initialEditingData.current)
    if (
      currentProjectData &&
      !isEqual(currentProjectData, initialEditingData.current)
    ) {
      const duration = BigNumber.from(
        currentProjectData.fundingCycleData.duration,
      ).toNumber()
      const fundingCycleData = currentProjectData.fundingCycleData
      const fundingCycleMetadata = currentProjectData.fundingCycleMetadata
      const mintRate = parseFloat(
        formatIssuanceRate(
          deriveNextIssuanceRate({
            weight: BigNumber.from(0),
            previousFC: deserializeV2V3FundingCycleData(
              currentProjectData.fundingCycleData,
            ),
          }).toString(),
        ),
      )
      const reservedTokens = fundingCycleMetadata.reservedRate
        ? parseFloat(formatReservedRate(fundingCycleMetadata.reservedRate))
        : DefaultTokenSettings.reservedTokensPercentage
      const reservedSplits =
        currentProjectData.payoutGroupedSplits.reservedTokensGroupedSplits
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
        ballot: currentProjectData.fundingCycleData.ballot,
        allowSetTerminals:
          currentProjectData.fundingCycleMetadata.global.allowSetTerminals,
        allowSetController:
          currentProjectData.fundingCycleMetadata.global.allowSetController,
        allowControllerMigration:
          currentProjectData.fundingCycleMetadata.allowControllerMigration,
        allowTerminalMigration:
          currentProjectData.fundingCycleMetadata.allowTerminalMigration,
        pausePay: currentProjectData.fundingCycleMetadata.pausePay,
        payoutSplits:
          currentProjectData.payoutGroupedSplits.payoutGroupedSplits,
        distributionLimit: distributionLimitStringtoNumber(
          currentProjectData.fundAccessConstraints[0]?.distributionLimit,
        ),
        distributionLimitCurrency:
          V2V3CurrencyName(
            BigNumber.from(
              currentProjectData.fundAccessConstraints[0]
                ?.distributionLimitCurrency ?? 0,
            ).toNumber() as V2V3CurrencyOption,
          ) ?? 'ETH',
        holdFees: currentProjectData.fundingCycleMetadata.holdFees,
        mintRate,
        reservedTokens,
        reservedSplits,
        discountRate,
        redemptionRate,
        allowTokenMinting,
        pauseTransfers: pauseTransfers,
        nftRewards: currentProjectData.nftRewards,
        useDataSourceForRedeem:
          currentProjectData.fundingCycleMetadata.useDataSourceForRedeem,
        memo: '',
      }
      setInitialFormData(formData)
      editCycleForm.setFieldsValue(formData)
      initialEditingData.current = currentProjectData
    }
  }, [currentProjectData, editCycleForm])
  return {
    initialFormData,
    editCycleForm,
  }
}
