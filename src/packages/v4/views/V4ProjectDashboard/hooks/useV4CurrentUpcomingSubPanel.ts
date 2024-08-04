import { t } from '@lingui/macro'
import {
  useJBRuleset,
  useReadJbRulesetsCurrentApprovalStatusForLatestRulesetOf,
} from 'juice-sdk-react'
import { V4ApprovalStatus } from 'models/ballot'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useMemo } from 'react'
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString'

export const useV4CurrentUpcomingSubPanel = (type: 'current' | 'upcoming') => {
  const { data: ruleset, isLoading: rulesetLoading } = useJBRuleset()
  const { ruleset: latestUpcomingRuleset, isLoading: upcomingRulesetsLoading } =
    useJBUpcomingRuleset()

  const { data: approvalStatus } =
    useReadJbRulesetsCurrentApprovalStatusForLatestRulesetOf()
  const rulesetNumber = useMemo(() => {
    if (type === 'current') {
      return Number(ruleset?.cycleNumber)
    }
    return latestUpcomingRuleset?.cycleNumber
      ? Number(latestUpcomingRuleset.cycleNumber)
      : ruleset?.cycleNumber
      ? ruleset.cycleNumber + 1
      : undefined
  }, [ruleset?.cycleNumber, type, latestUpcomingRuleset?.cycleNumber])

  const rulesetUnlocked = useMemo(() => {
    if (type === 'current') {
      return ruleset?.duration === 0 ?? true
    }
    return latestUpcomingRuleset?.duration == 0 ?? true
  }, [ruleset?.duration, type, latestUpcomingRuleset?.duration])

  const upcomingRulesetLength = useMemo(() => {
    if (!latestUpcomingRuleset)
      return timeSecondsToDateString(Number(ruleset?.duration), 'short')
    if (rulesetUnlocked) return '-'
    return timeSecondsToDateString(
      Number(latestUpcomingRuleset.duration),
      'short',
    )
  }, [rulesetUnlocked, latestUpcomingRuleset, ruleset])

  /** Determines if the CURRENT cycle is unlocked.
   * This is used to check if the upcoming cycle can start at any time. */
  const currentRulesetUnlocked = ruleset?.duration === 0 ?? true

  const status = rulesetUnlocked ? t`Unlocked` : t`Locked`

  // Short circuit current for faster loading
  if (type === 'current') {
    if (rulesetLoading) return { loading: true, type }
    return {
      loading: false,
      type,
      rulesetNumber,
      status,
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
