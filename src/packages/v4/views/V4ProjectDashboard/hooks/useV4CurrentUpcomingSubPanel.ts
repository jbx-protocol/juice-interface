import { t } from '@lingui/macro'
import {
  useJBRuleset,
  useReadJbRulesetsCurrentApprovalStatusForLatestRulesetOf
} from 'juice-sdk-react'
import { V4ApprovalStatus } from 'models/ballot'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useMemo } from 'react'
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString'
import { useRulesetCountdown } from './useRulesetCountdown'

export const useV4CurrentUpcomingSubPanel = (type: 'current' | 'upcoming') => {
  const { data: ruleset, isLoading: rulesetLoading } = useJBRuleset()
  const { ruleset: latestUpcomingRuleset, isLoading: upcomingRulesetsLoading } =
    useJBUpcomingRuleset()
  const { timeRemainingText } = useRulesetCountdown()

  const { data: approvalStatus } =
    useReadJbRulesetsCurrentApprovalStatusForLatestRulesetOf()
  const rulesetNumber = useMemo(() => {
    if (type === 'current') {
      return Number(ruleset?.cycleNumber)
    }
    return latestUpcomingRuleset?.cycleNumber
      ? Number(latestUpcomingRuleset.cycleNumber)
      : ruleset?.cycleNumber ?  ruleset.cycleNumber + 1n : undefined
  }, [ruleset?.cycleNumber, type, latestUpcomingRuleset?.cycleNumber])

  const rulesetUnlocked = useMemo(() => {
    if (type === 'current') {
      return ruleset?.duration === 0n ?? true
    }
    return latestUpcomingRuleset?.duration == 0n ?? true
  }, [ruleset?.duration, type, latestUpcomingRuleset?.duration])

  const upcomingRulesetLength = useMemo(() => {
    if (!latestUpcomingRuleset) return timeSecondsToDateString(Number(ruleset?.duration), 'short')
    if (rulesetUnlocked) return '-'
    return timeSecondsToDateString(
      Number(latestUpcomingRuleset.duration),
      'short',
    )
  }, [rulesetUnlocked, latestUpcomingRuleset, ruleset])

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

  if (rulesetLoading || upcomingRulesetsLoading)
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
       * The only way it would, is if the approval status of the latestUpcomingRuleset is `approved`.
       */
      rulesetUnlocked &&
      typeof approvalStatus !== 'undefined' &&
      approvalStatus !== null &&
      approvalStatus === V4ApprovalStatus.Approved,
  }
}
