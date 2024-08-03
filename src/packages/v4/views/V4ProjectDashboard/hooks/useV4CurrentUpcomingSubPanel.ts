import { t } from '@lingui/macro'
import {
  useJBRuleset,
  useReadJbRulesetsCurrentApprovalStatusForLatestRulesetOf,
  useReadJbRulesetsLatestQueuedOf,
} from 'juice-sdk-react'
import { V4ApprovalStatus } from 'models/ballot'
import { useMemo } from 'react'
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString'
import { useRulesetCountdown } from './useRulesetCountdown'

export const useV4CurrentUpcomingSubPanel = (type: 'current' | 'upcoming') => {
  const { data: ruleset, isLoading: rulesetLoading } = useJBRuleset()
  const { data: _latestQueuedRuleset, isLoading: queuedRulesetsLoading } =
    useReadJbRulesetsLatestQueuedOf()
  const { timeRemainingText } = useRulesetCountdown()

  const latestQueuedRuleset = _latestQueuedRuleset?.[0]
  const { data: approvalStatus } =
    useReadJbRulesetsCurrentApprovalStatusForLatestRulesetOf()

  const rulesetNumber = useMemo(() => {
    if (type === 'current') {
      return Number(ruleset?.cycleNumber)
    }
    return latestQueuedRuleset?.cycleNumber
      ? Number(latestQueuedRuleset.cycleNumber)
      : undefined
  }, [ruleset?.cycleNumber, type, latestQueuedRuleset?.cycleNumber])

  const rulesetUnlocked = useMemo(() => {
    if (type === 'current') {
      return ruleset?.duration === 0n ?? true
    }
    return latestQueuedRuleset?.duration == 0n ?? true
  }, [ruleset?.duration, type, latestQueuedRuleset?.duration])

  const upcomingRulesetLength = useMemo(() => {
    if (!latestQueuedRuleset) return
    if (rulesetUnlocked) return '-'
    return timeSecondsToDateString(
      Number(latestQueuedRuleset.duration),
      'short',
    )
  }, [rulesetUnlocked, latestQueuedRuleset])

  /** Determines if the CURRENT cycle is unlocked.
   * This is used to check if the upcoming cycle can start at any time. */
  const currentRulesetUnlocked = ruleset?.duration === 0n ?? true

  const status = rulesetUnlocked ? t`Unlocked` : t`Locked`
  const remainingTime = rulesetUnlocked ? '-' : timeRemainingText

  // Short circuit current for faster loading
  if (type === 'current') {
    if (rulesetLoading) return { loading: true, type }
    return {
      loading: false,
      type,
      rulesetNumber,
      status,
      remainingTime,
    }
  }

  if (rulesetLoading || queuedRulesetsLoading)
    return {
      loading: true,
      type,
    }

  return {
    loading: false,
    type,
    rulesetNumber,
    status,
    rulesetLength: upcomingRulesetLength,
    rulesetUnlocked,
    currentRulesetUnlocked,
    hasPendingConfiguration:
      /**
       * If a ruleset is unlocked, it may have a pending change.
       * The only way it would, is if the approval status of the latestQueuedRuleset is `approved`.
       */
      rulesetUnlocked &&
      typeof approvalStatus !== 'undefined' &&
      approvalStatus !== null &&
      approvalStatus === V4ApprovalStatus.Approved,
  }
}
