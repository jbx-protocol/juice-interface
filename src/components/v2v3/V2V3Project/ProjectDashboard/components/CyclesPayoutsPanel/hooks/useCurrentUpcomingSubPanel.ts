import { t } from '@lingui/macro'
import { useFundingCycleCountdown } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useFundingCycleCountdown'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { timeSecondsToDateString } from 'components/v2v3/V2V3Project/ProjectDashboard/utils/timeSecondsToDateString'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { BallotState } from 'models/v2v3/fundingCycle'
import { useMemo } from 'react'

export const useCurrentUpcomingSubPanel = (type: 'current' | 'upcoming') => {
  const { projectId } = useProjectMetadataContext()
  const {
    fundingCycle,
    loading: { fundingCycleLoading },
  } = useProjectContext()
  const {
    data: upcomingFundingCycleData,
    loading: upcomingFundingCycleLoading,
  } = useProjectUpcomingFundingCycle({
    projectId,
    /**
     * if the current cycle is unlocked, force the use of latestConfiguredFundingCycleOf.
     */
    useLatestConfigured: fundingCycle?.duration === 0n ?? false,
  })
  const [upcomingFundingCycle, , ballotState] = upcomingFundingCycleData ?? []
  const { timeRemainingText } = useFundingCycleCountdown()

  const cycleNumber = useMemo(() => {
    if (type === 'current') {
      return fundingCycle?.number ? Number(fundingCycle?.number) : undefined
    }
    return fundingCycle?.number ? Number(fundingCycle.number) + 1 : undefined
  }, [fundingCycle?.number, type])

  const cycleUnlocked = useMemo(() => {
    if (type === 'current') {
      return fundingCycle?.duration === 0n ?? true
    }
    return upcomingFundingCycle?.duration === 0n ?? true
  }, [fundingCycle?.duration, type, upcomingFundingCycle?.duration])

  const upcomingCycleLength = useMemo(() => {
    if (!upcomingFundingCycle) return
    if (cycleUnlocked) return '-'
    return timeSecondsToDateString(
      Number(upcomingFundingCycle.duration),
      'short',
    )
  }, [cycleUnlocked, upcomingFundingCycle])

  /** Determines if the CURRENT cycle is unlocked.
   * This is used to check if the upcoming cycle can start at any time. */
  const currentCycleUnlocked = fundingCycle?.duration === 0n ?? true

  const status = cycleUnlocked ? t`Unlocked` : t`Locked`
  const remainingTime = cycleUnlocked ? '-' : timeRemainingText

  // Short circuit current for faster loading
  if (type === 'current') {
    if (fundingCycleLoading) return { loading: true, type }
    return {
      loading: false,
      type,
      cycleNumber,
      status,
      remainingTime,
    }
  }

  if (fundingCycleLoading || upcomingFundingCycleLoading)
    return {
      loading: true,
      type,
    }

  return {
    loading: false,
    type,
    cycleNumber,
    status,
    cycleLength: upcomingCycleLength,
    cycleUnlocked,
    currentCycleUnlocked,
    hasPendingConfiguration:
      /**
       * If a cycle is unlocked, it may have a pending change.
       * The only way it would, is if the ballot state of the latestConfiguredFC is `approved`.
       */
      cycleUnlocked &&
      typeof ballotState !== 'undefined' &&
      ballotState !== null &&
      ballotState === BallotState.approved,
  }
}
