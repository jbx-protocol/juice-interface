import { t } from '@lingui/macro'
import { ConfigurationPanelDatum } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import { JBRulesetData } from 'juice-sdk-core'
import { V4CurrencyOption } from 'packages/v4/models/v4CurrencyOption'
import { getApprovalStrategyByAddress } from 'packages/v4/utils/approvalHooks'
import { formatCurrencyAmount } from 'packages/v4/utils/formatV4CurrencyAmount'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { useMemo } from 'react'
import { formatTime } from 'utils/format/formatTime'
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString'

export const useV4FormatConfigurationCycleSection = ({
  ruleset,
  payoutLimitAmountCurrency,
  upcomingRuleset,
  upcomingRulesetLoading,
  upcomingPayoutLimitLoading,
  upcomingPayoutLimitAmountCurrency,
}: {
  ruleset?: JBRulesetData | null
  payoutLimitAmountCurrency: {
    amount: bigint | undefined
    currency: V4CurrencyOption | undefined
  }
  upcomingRuleset?: JBRulesetData | null
  upcomingRulesetLoading: boolean
  upcomingPayoutLimitLoading: boolean
  upcomingPayoutLimitAmountCurrency?: {
    amount: bigint | undefined
    currency: V4CurrencyOption | undefined
  } | null
}) => {
  const formatDuration = (duration: number | undefined) => {
    if (duration === undefined) return undefined
    if (duration === 0) return t`Not set`
    return timeSecondsToDateString(Number(duration), 'short', 'lower')
  }

  const durationDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentDuration = formatDuration(ruleset?.duration)
    if (upcomingRuleset === null || upcomingRulesetLoading) {
      return pairToDatum(t`Duration`, currentDuration, null)
    }
    const upcomingDuration = formatDuration(
      upcomingRuleset ? upcomingRuleset?.duration : ruleset?.duration,
    )

    return pairToDatum(t`Duration`, currentDuration, upcomingDuration)
  }, [ruleset?.duration, upcomingRuleset, upcomingRulesetLoading])

  const upcomingRulesetStart = ruleset?.start
    ? ruleset.start + (ruleset?.duration || 0)
    : 0

  const startTimeDatum: ConfigurationPanelDatum = useMemo(() => {
    const formattedTime =
      upcomingRuleset === null
        ? formatTime(ruleset?.start)
        : ruleset?.duration === 0
        ? t`Any time`
        : formatTime(upcomingRulesetStart)

    const formatTimeDatum: ConfigurationPanelDatum = {
      name: t`Start time`,
      new: formattedTime,
      easyCopy: true,
    }
    return formatTimeDatum
  }, [ruleset?.start, ruleset?.duration, upcomingRuleset, upcomingRulesetStart])

  const formatPayoutAmount = (
    amount: bigint | undefined,
    currency: V4CurrencyOption | undefined,
  ) => {
    if (amount === undefined || amount === MAX_PAYOUT_LIMIT) return t`Unlimited`
    if (amount === 0n) return t`Zero (no payouts)`
    return formatCurrencyAmount({
      amount: Number(amount) / 1e18, // Assuming fromWad
      currency,
    })
  }

  const payoutsDatum: ConfigurationPanelDatum = useMemo(() => {
    const { amount, currency } = payoutLimitAmountCurrency ?? {}
    const currentPayout = formatPayoutAmount(amount, currency)

    if (
      upcomingPayoutLimitAmountCurrency === null ||
      upcomingPayoutLimitLoading
    ) {
      return pairToDatum(t`Payouts`, currentPayout, null)
    }

    const upcomingPayoutLimit =
      upcomingPayoutLimitAmountCurrency?.amount !== undefined
        ? upcomingPayoutLimitAmountCurrency.amount
        : amount
    const upcomingPayoutLimitCurrency =
      upcomingPayoutLimitAmountCurrency?.currency !== undefined
        ? upcomingPayoutLimitAmountCurrency.currency
        : currency
    const upcomingPayout = formatPayoutAmount(
      upcomingPayoutLimit,
      upcomingPayoutLimitCurrency,
    )

    return pairToDatum(t`Payouts`, currentPayout, upcomingPayout)
  }, [
    payoutLimitAmountCurrency,
    upcomingPayoutLimitAmountCurrency,
    upcomingPayoutLimitLoading,
  ])

  const editDeadlineDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentApprovalStrategy = ruleset?.approvalHook
      ? getApprovalStrategyByAddress(ruleset.approvalHook)
      : undefined
    const current = currentApprovalStrategy?.name
    if (upcomingRuleset === null || upcomingPayoutLimitLoading) {
      return pairToDatum(t`Edit deadline`, current, null)
    }

    const upcomingBallotStrategy = upcomingRuleset?.approvalHook
      ? getApprovalStrategyByAddress(upcomingRuleset.approvalHook)
      : ruleset?.approvalHook
      ? getApprovalStrategyByAddress(ruleset.approvalHook)
      : undefined

    const upcoming = upcomingBallotStrategy?.name
    return pairToDatum(t`Edit deadline`, current, upcoming)
  }, [ruleset?.approvalHook, upcomingRuleset, upcomingPayoutLimitLoading])

  return useMemo(() => {
    return {
      duration: durationDatum,
      startTime: startTimeDatum,
      payouts: payoutsDatum,
      editDeadline: editDeadlineDatum,
    }
  }, [durationDatum, startTimeDatum, editDeadlineDatum, payoutsDatum])
}
