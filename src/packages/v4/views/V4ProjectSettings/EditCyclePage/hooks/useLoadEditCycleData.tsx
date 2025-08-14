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
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
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
  const { ruleset, rulesetMetadata, isLoading: rulesetLoading } = useJBRuleset({ projectId, chainId })
  const { ruleset: upcomingRuleset, isLoading: upcomingRulesetLoading } = useJBUpcomingRuleset()
  const { splits: reservedTokensSplits, isLoading: reservedSplitsLoading } = useV4ReservedSplits()
  const { data: payoutSplits, isLoading: payoutsLoading } = useV4CurrentPayoutSplits()
  const { data: payoutLimit, isLoading: payoutLimitLoading } = usePayoutLimit()

  const [editCycleForm] = Form.useForm<EditCycleFormFields>()
  const payoutLimitAmount = useMemo(
    () => (payoutLimit && payoutLimit.amount !== MAX_PAYOUT_LIMIT ? new Ether(payoutLimit.amount).toFloat() : undefined),
    [payoutLimit]
  )

  const duration = useMemo(
    () => (ruleset ? Number(ruleset.duration) : undefined),
    [ruleset]
  )

  const issuanceRate = useMemo(
    () => (duration === 0 ? ruleset?.weight?.toFloat() : upcomingRuleset?.weight?.toFloat()),
    [upcomingRuleset, ruleset, duration]
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
      reservedTokensSplits !== undefined &&
      !rulesetLoading &&
      !upcomingRulesetLoading &&
      !payoutsLoading &&
      !payoutLimitLoading &&
      !reservedSplitsLoading,
    [
      ruleset,
      rulesetMetadata,
      upcomingRuleset,
      payoutSplits,
      payoutLimit,
      reservedTokensSplits,
      rulesetLoading,
      upcomingRulesetLoading,
      payoutsLoading,
      payoutLimitLoading,
      reservedSplitsLoading,
    ]
  )

  const memoizedFormData = useMemo(() => {
    if (!isDataLoaded) return undefined

    return {
      duration: secondsToOtherUnit({
        duration: duration ?? 0,
        unit: deriveDurationUnit(duration),
      }),
      durationUnit: deriveDurationOption(duration),
      approvalHook: (ruleset?.approvalHook ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      allowSetTerminals: rulesetMetadata?.allowSetTerminals,
      allowSetController: rulesetMetadata?.allowSetController,
      allowTerminalMigration: rulesetMetadata?.allowSetController,
      pausePay: rulesetMetadata?.pausePay,
      payoutSplits: payoutSplits ?? [],
      payoutLimit: payoutLimitAmount,
      payoutLimitCurrency: V4CurrencyName(payoutLimit.currency) ?? 'ETH',
      holdFees: rulesetMetadata?.holdFees,
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
    if (!isDataLoaded || initialFormData) {
      return
    }
    setInitialFormData(memoizedFormData as EditCycleFormFields) 
    editCycleForm.setFieldsValue(memoizedFormData as EditCycleFormFields)
  }, [isDataLoaded, memoizedFormData, initialFormData, editCycleForm])

  return {
    initialFormData,
    editCycleForm,
  }
}
