import { Form } from 'antd'
import { DefaultSettings as DefaultTokenSettings } from 'components/Create/components/pages/ProjectToken/hooks/useProjectTokenForm'
import isEqual from 'lodash/isEqual'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3CurrencyName } from 'packages/v2v3/utils/currency'
import { distributionLimitStringtoNumber } from 'packages/v2v3/utils/distributions'
import { deriveNextIssuanceRate } from 'packages/v2v3/utils/fundingCycle'
import {
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'packages/v2v3/utils/math'
import { deserializeV2V3FundingCycleData } from 'packages/v2v3/utils/serializers'
import { useEffect, useRef, useState } from 'react'
import {
  deriveDurationOption,
  deriveDurationUnit,
  secondsToOtherUnit,
} from 'utils/format/formatTime'
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
    if (
      !currentProjectData ||
      isEqual(currentProjectData, initialEditingData.current)
    ) {
      return
    }

    const fundingCycleData = currentProjectData.fundingCycleData
    const fundingCycleMetadata = currentProjectData.fundingCycleMetadata
    if (!fundingCycleData || !fundingCycleMetadata) return

    const duration = Number(BigInt(fundingCycleData.duration))

    const mintRate = parseFloat(
      formatIssuanceRate(
        deriveNextIssuanceRate({
          weight: BigInt(0),
          previousFC: deserializeV2V3FundingCycleData(fundingCycleData),
        }).toString(),
      ),
    )
    const reservedTokens =
      fundingCycleMetadata !== undefined
        ? parseFloat(formatReservedRate(fundingCycleMetadata.reservedRate))
        : DefaultTokenSettings.reservedTokensPercentage
    const reservedSplits =
      currentProjectData.payoutGroupedSplits.reservedTokensGroupedSplits
    const discountRate =
      fundingCycleData !== undefined
        ? parseFloat(formatDiscountRate(fundingCycleData.discountRate))
        : DefaultTokenSettings.discountRate
    const redemptionRate =
      fundingCycleMetadata.redemptionRate !== undefined
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
      allowSetTerminals: fundingCycleMetadata.global.allowSetTerminals,
      allowSetController: fundingCycleMetadata.global.allowSetController,
      allowControllerMigration: fundingCycleMetadata.allowControllerMigration,
      allowTerminalMigration: fundingCycleMetadata.allowTerminalMigration,
      pausePay: fundingCycleMetadata.pausePay,
      payoutSplits: currentProjectData.payoutGroupedSplits.payoutGroupedSplits,
      distributionLimit: distributionLimitStringtoNumber(
        currentProjectData.fundAccessConstraints[0]?.distributionLimit,
      ),
      distributionLimitCurrency:
        V2V3CurrencyName(
          Number(
            BigInt(
              currentProjectData.fundAccessConstraints[0]
                ?.distributionLimitCurrency ?? 0,
            ),
          ) as V2V3CurrencyOption,
        ) ?? 'ETH',
      holdFees: fundingCycleMetadata.holdFees,
      mintRate,
      reservedTokens,
      reservedSplits,
      discountRate,
      redemptionRate,
      allowTokenMinting,
      pauseTransfers: pauseTransfers,
      nftRewards: currentProjectData.nftRewards,
      useDataSourceForRedeem: fundingCycleMetadata.useDataSourceForRedeem,
      memo: '',
    }

    setInitialFormData(formData)
    editCycleForm.setFieldsValue(formData)
    initialEditingData.current = currentProjectData
  }, [currentProjectData, editCycleForm])

  return {
    initialFormData,
    editCycleForm,
  }
}
