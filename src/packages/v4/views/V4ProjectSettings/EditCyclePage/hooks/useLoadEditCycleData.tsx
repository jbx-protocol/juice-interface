import {
  deriveDurationOption,
  deriveDurationUnit,
  secondsToOtherUnit,
} from 'utils/format/formatTime'
import { useEffect, useMemo, useState } from 'react'
import { useJBProjectId, useJBRuleset } from 'juice-sdk-react'

import { EditCycleFormFields } from '../EditCycleFormFields'
import { Ether } from 'juice-sdk-core'
import { Form } from 'antd'
import { V4CurrencyName } from 'packages/v4/utils/currency'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useV4CurrentPayoutSplits } from 'packages/v4/hooks/useV4CurrentPayoutSplits'
import { useV4ReservedSplits } from 'packages/v4/hooks/useV4ReservedSplits'

/** Loads project FC data directly into an AntD form instance */
export const useLoadEditCycleData = () => {
  const [initialFormData, setInitialFormData] = useState<
    EditCycleFormFields | undefined
  >(undefined)

  const { projectId, chainId } = useJBProjectId()
  const { ruleset, rulesetMetadata } = useJBRuleset({ projectId, chainId })
  const { ruleset: upcomingRuleset } = useJBUpcomingRuleset()
  const { splits: reservedTokensSplits } = useV4ReservedSplits()
  const { data: payoutSplits } = useV4CurrentPayoutSplits()
  const { data: payoutLimit } = usePayoutLimit()

  const [editCycleForm] = Form.useForm<EditCycleFormFields>()

  const payoutLimitAmount = useMemo(
    () => (payoutLimit ? new Ether(payoutLimit.amount).toFloat() : undefined),
    [payoutLimit]
  )

  const duration = useMemo(
    () => (ruleset ? Number(ruleset.duration) : undefined),
    [ruleset]
  )

  const issuanceRate = useMemo(
    () => (upcomingRuleset ? upcomingRuleset.weight?.toFloat() : undefined),
    [upcomingRuleset]
  )

  const reservedPercent = useMemo(
    () => (rulesetMetadata ? rulesetMetadata.reservedPercent?.formatPercentage() : undefined),
    [rulesetMetadata]
  )

  const weightCutPercent = useMemo(
    () => (ruleset ? ruleset.weightCutPercent?.formatPercentage() : undefined),
    [ruleset]
  )

  const cashOutTaxRate = useMemo(
    () => (rulesetMetadata ? rulesetMetadata.cashOutTaxRate?.formatPercentage() : undefined),
    [rulesetMetadata]
  )

  const allowOwnerMinting = useMemo(
    () => (rulesetMetadata ? rulesetMetadata.allowOwnerMinting : undefined),
    [rulesetMetadata]
  )

  const tokenTransfers = useMemo(
    () => (rulesetMetadata ? !rulesetMetadata.pauseCreditTransfers : undefined),
    [rulesetMetadata]
  )

  const isDataLoaded = useMemo(
    () =>
      ruleset !== undefined &&
      rulesetMetadata !== undefined &&
      upcomingRuleset !== undefined &&
      payoutSplits !== undefined &&
      payoutLimit !== undefined &&
      reservedTokensSplits !== undefined,
    [
      ruleset,
      rulesetMetadata,
      upcomingRuleset,
      payoutSplits,
      payoutLimit,
      reservedTokensSplits,
    ]
  )

  const memoizedFormData = useMemo(() => {
    if (!isDataLoaded || !ruleset || !rulesetMetadata || !duration) return undefined

    return {
      duration: secondsToOtherUnit({
        duration: duration,
        unit: deriveDurationUnit(duration),
      }),
      durationUnit: deriveDurationOption(duration),
      approvalHook: ruleset.approvalHook,
      allowSetTerminals: rulesetMetadata.allowSetTerminals,
      allowSetController: rulesetMetadata.allowSetController,
      allowTerminalMigration: rulesetMetadata.allowSetController,
      pausePay: rulesetMetadata.pausePay,
      payoutSplits: payoutSplits ?? [],
      payoutLimit: payoutLimitAmount,
      payoutLimitCurrency: V4CurrencyName(payoutLimit.currency) ?? 'ETH',
      holdFees: rulesetMetadata.holdFees,
      issuanceRate: issuanceRate,
      reservedPercent: reservedPercent,
      reservedTokensSplits: reservedTokensSplits ?? [],
      weightCutPercent: weightCutPercent,
      cashOutTaxRate: cashOutTaxRate,
      allowOwnerMinting: allowOwnerMinting,
      tokenTransfers: tokenTransfers,
      memo: '',
    }
  }, [
    isDataLoaded,
    duration,
    ruleset,
    rulesetMetadata,
    payoutSplits,
    payoutLimitAmount,
    payoutLimit,
    reservedTokensSplits,
    issuanceRate,
    reservedPercent,
    weightCutPercent,
    cashOutTaxRate,
    allowOwnerMinting,
    tokenTransfers,
  ])

  useEffect(() => {
    if (!isDataLoaded || initialFormData) return
    setInitialFormData(memoizedFormData as EditCycleFormFields) 
    editCycleForm.setFieldsValue(memoizedFormData as EditCycleFormFields)
  }, [isDataLoaded, memoizedFormData, initialFormData, editCycleForm])

  return {
    initialFormData,
    editCycleForm,
  }
}
