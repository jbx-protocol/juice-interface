import { useJBProjectId, useJBRuleset } from 'juice-sdk-react'
import { useEffect, useState } from 'react'

import { Form } from 'antd'
import { Ether } from 'juice-sdk-core'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useV4CurrentPayoutSplits } from 'packages/v4/hooks/useV4CurrentPayoutSplits'
import { useV4ReservedSplits } from 'packages/v4/hooks/useV4ReservedSplits'
import { V4CurrencyName } from 'packages/v4/utils/currency'
import {
  deriveDurationOption,
  deriveDurationUnit,
  secondsToOtherUnit,
} from 'utils/format/formatTime'
import { EditCycleFormFields } from '../EditCycleFormFields'

/** Loads project FC data directly into an AntD form instance */
export const useLoadEditCycleData = () => {
  const [initialFormData, setInitialFormData] = useState<
    EditCycleFormFields | undefined
  >(undefined)

  const { projectId, chainId } = useJBProjectId()
  const { ruleset, rulesetMetadata } = useJBRuleset({
    projectId,
    chainId,
  })
  const { ruleset: upcomingRuleset } = useJBUpcomingRuleset()

  const { splits: reservedTokensSplits } = useV4ReservedSplits()
  const { data: payoutSplits } = useV4CurrentPayoutSplits()
  const { data: payoutLimit } = usePayoutLimit()

  const [editCycleForm] = Form.useForm<EditCycleFormFields>()

  useEffect(() => {
    if (!ruleset || !rulesetMetadata) {
      return
    }
    const payoutLimitAmount = new Ether(payoutLimit.amount).toFloat()

    const duration = Number(ruleset.duration)

    const issuanceRate = upcomingRuleset?.weight.toFloat() ?? 0
    const reservedPercent = rulesetMetadata.reservedPercent.formatPercentage()
    // : DefaultTokenSettings.reservedTokensPercentage

    const weightCutPercent = ruleset.weightCutPercent.formatPercentage()
    // : DefaultTokenSettings.discountRate

    const cashOutTaxRate = rulesetMetadata.cashOutTaxRate.formatPercentage()
    // : DefaultTokenSettings.cashOutTaxRate

    const allowOwnerMinting = rulesetMetadata.allowOwnerMinting
    // : DefaultTokenSettings.tokenMinting

    const tokenTransfers = !rulesetMetadata.pauseCreditTransfers
    // : DefaultTokenSettings.pauseTransfers

    const formData: EditCycleFormFields = {
      duration: secondsToOtherUnit({
        duration,
        unit: deriveDurationUnit(duration),
      }),
      durationUnit: deriveDurationOption(duration),
      approvalHook: ruleset.approvalHook,
      allowSetTerminals: rulesetMetadata.allowSetTerminals,
      allowSetController: rulesetMetadata.allowSetController,
      allowTerminalMigration: rulesetMetadata.allowTerminalMigration,
      pausePay: rulesetMetadata.pausePay,
      payoutSplits: payoutSplits ?? [],
      payoutLimit: payoutLimitAmount,
      payoutLimitCurrency: V4CurrencyName(payoutLimit?.currency) ?? 'ETH',
      holdFees: rulesetMetadata?.holdFees,
      issuanceRate,
      reservedPercent,
      reservedTokensSplits,
      weightCutPercent,
      cashOutTaxRate,
      allowOwnerMinting,
      tokenTransfers,
      // nftRewards: currentProjectData.nftRewards,
      // useDataSourceForRedeem:
      //   rulesetMetadata.useDataSourceForRedeem,
      memo: '',
    }
    if (!initialFormData) {
      setInitialFormData(formData)
    }
    editCycleForm.setFieldsValue(formData)
  }, [
    initialFormData,
    editCycleForm,
    ruleset,
    rulesetMetadata,
    payoutSplits,
    payoutLimit,
    reservedTokensSplits,
    upcomingRuleset?.weight,
  ])

  return {
    initialFormData,
    editCycleForm,
  }
}
