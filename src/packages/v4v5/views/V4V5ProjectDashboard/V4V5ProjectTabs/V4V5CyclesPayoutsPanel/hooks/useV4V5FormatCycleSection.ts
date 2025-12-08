import { t } from '@lingui/macro'
import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import { JBRulesetData } from 'juice-sdk-core'
import { useJBChainId } from 'juice-sdk-react'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { getApprovalStrategyByAddress } from 'packages/v4v5/utils/approvalHooks'
import { useMemo } from 'react'
import { formatTime } from 'utils/format/formatTime'
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString'

export const useV4V5FormatCycleSection = (
  ruleset: JBRulesetData | undefined,
): ConfigurationPanelTableData => {
  const { version } = useV4V5Version()
  const chainId = useJBChainId()

  const formatDuration = (duration: number | undefined) => {
    if (duration === undefined) return undefined
    if (duration === 0) return t`Not set`
    return timeSecondsToDateString(Number(duration), 'short', 'lower')
  }

  const durationDatum = useMemo(() => {
    const duration = formatDuration(ruleset?.duration)
    return pairToDatum(t`Duration`, duration, null)
  }, [ruleset?.duration])

  const startTimeDatum = useMemo(() => {
    const startTime = formatTime(ruleset?.start)
    return pairToDatum(t`Start time`, startTime, null, undefined, true)
  }, [ruleset?.start])

  const editDeadlineDatum = useMemo(() => {
    const approvalStrategy =
      ruleset?.approvalHook && version && chainId
        ? getApprovalStrategyByAddress(ruleset.approvalHook, version, chainId)
        : undefined
    const approvalStrategyName = approvalStrategy?.name
    return pairToDatum(t`Rule change deadline`, approvalStrategyName, null)
  }, [ruleset?.approvalHook, version, chainId])

  return useMemo(() => {
    return {
      duration: durationDatum,
      startTime: startTimeDatum,
      editDeadline: editDeadlineDatum,
    }
  }, [durationDatum, startTimeDatum, editDeadlineDatum])
}
