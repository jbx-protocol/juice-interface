import {
  useJBProjectId,
  useJBRuleset,
  useReadJbRulesetsCurrentApprovalStatusForLatestRulesetOf,
} from 'juice-sdk-react'

import { V4ApprovalStatus } from 'models/approvalHooks'
import { t } from '@lingui/macro'
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString'
import { useCyclesPanelSelectedChain } from '../V4ProjectTabs/V4CyclesPayoutsPanel/contexts/CyclesPanelSelectedChainContext'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useMemo } from 'react'

export const useV4CurrentUpcomingSubPanel = (type: 'current' | 'upcoming') => {
  const { selectedChainId } = useCyclesPanelSelectedChain()
  const { projectId } = useJBProjectId(selectedChainId)
  const { ruleset, isLoading: rulesetLoading } = useJBRuleset({
    chainId: selectedChainId,
    projectId,
  })

  const { ruleset: latestUpcomingRuleset, isLoading: upcomingRulesetsLoading } =
    useJBUpcomingRuleset(selectedChainId)

  const start = useMemo(() => {
    if (type === 'upcoming') {
      return latestUpcomingRuleset?.start
    }
    return ruleset?.start
  }, [type, latestUpcomingRuleset?.start, ruleset?.start])

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
      return Boolean(ruleset?.duration && ruleset?.duration === 0) ?? true
    }
    return (
      Boolean(latestUpcomingRuleset && latestUpcomingRuleset.duration === 0) ??
      true
    )
  }, [ruleset?.duration, type, latestUpcomingRuleset])

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
  const currentRulesetUnlocked =
    Boolean(ruleset && ruleset?.duration === 0) ?? true

  const status = (type === 'current' ? currentRulesetUnlocked : rulesetUnlocked)
    ? t`Unlocked`
    : t`Locked`

  if (rulesetLoading || upcomingRulesetsLoading) {
    return {
      loading: true,
      type,
    }
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
    start,
  }
}
