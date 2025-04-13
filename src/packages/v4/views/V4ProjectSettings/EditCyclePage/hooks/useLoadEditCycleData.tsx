import { useJBProjectId, useJBRuleset } from 'juice-sdk-react'
import { useEffect, useMemo, useState } from 'react'
import {
  deriveDurationOption,
  deriveDurationUnit,
  secondsToOtherUnit,
} from 'utils/format/formatTime'

import { Form } from 'antd'
import { Ether } from 'juice-sdk-core'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useV4CurrentPayoutSplits } from 'packages/v4/hooks/useV4CurrentPayoutSplits'
import { useV4ReservedSplits } from 'packages/v4/hooks/useV4ReservedSplits'
import { V4CurrencyName } from 'packages/v4/utils/currency'
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

  const payoutLimitAmount = useMemo(
    () => new Ether(payoutLimit.amount).toFloat(),
    [payoutLimit.amount]
  )

  const duration = useMemo(
    () => Number(ruleset?.duration ?? 0),
    [ruleset?.duration]
  )

  const issuanceRate = useMemo(
    () => upcomingRuleset?.weight?.toFloat() ?? 0,
    [upcomingRuleset?.weight]
  )

  const reservedPercent = useMemo(
    () => rulesetMetadata?.reservedPercent?.formatPercentage() ?? 0,
    [rulesetMetadata?.reservedPercent]
  )

  const weightCutPercent = useMemo(
    () => ruleset?.weightCutPercent?.formatPercentage() ?? 0,
    [ruleset?.weightCutPercent]
  )

  const cashOutTaxRate = useMemo(
    () => rulesetMetadata?.cashOutTaxRate?.formatPercentage() ?? 0,
    [rulesetMetadata?.cashOutTaxRate]
  )

  const allowOwnerMinting = useMemo(
    () => rulesetMetadata?.allowOwnerMinting ?? false,
    [rulesetMetadata?.allowOwnerMinting]
  )

  const tokenTransfers = useMemo(
    () => !rulesetMetadata?.pauseCreditTransfers,
    [rulesetMetadata?.pauseCreditTransfers]
  )

  const memoizedFormData: EditCycleFormFields | undefined = useMemo(() => {
    if (!ruleset || !rulesetMetadata) return undefined

    return {
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
      memo: '',
    }
  }, [
    ruleset,
    rulesetMetadata,
    payoutSplits,
    payoutLimitAmount,
    payoutLimit?.currency,
    reservedTokensSplits,
    duration,
    issuanceRate,
    reservedPercent,
    weightCutPercent,
    cashOutTaxRate,
    allowOwnerMinting,
    tokenTransfers,
  ])

  // ✅ EFFECT DEPENDS ONLY ON STABLE FORM DATA
  useEffect(() => {
    if (!memoizedFormData || initialFormData) return

    setInitialFormData(memoizedFormData)
    editCycleForm.setFieldsValue(memoizedFormData)
  }, [memoizedFormData, initialFormData, editCycleForm])

  return {
    initialFormData,
    editCycleForm,
  }
}
