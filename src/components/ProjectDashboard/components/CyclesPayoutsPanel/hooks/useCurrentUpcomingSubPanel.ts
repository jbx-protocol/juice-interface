import { t } from '@lingui/macro'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { useFundingCycleCountdown } from 'components/ProjectDashboard/hooks/useFundingCycleCountdown'
import { timeSecondsToDateString } from 'components/ProjectDashboard/utils/timeSecondsToDateString'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { useMemo } from 'react'

export const useCurrentUpcomingSubPanel = (type: 'current' | 'upcoming') => {
  const { projectId } = useProjectMetadata()
  const {
    fundingCycle,
    loading: { fundingCycleLoading },
  } = useProjectContext()
  const {
    data: upcomingFundingCycleData,
    loading: upcomingFundingCycleLoading,
  } = useProjectUpcomingFundingCycle({ projectId })
  const [upcomingFundingCycle] = upcomingFundingCycleData ?? []
  const { timeRemainingText: remainingTime } = useFundingCycleCountdown()

  const cycleNumber = useMemo(() => {
    if (type === 'current') {
      return fundingCycle?.number.toNumber()
    }
    return fundingCycle?.number ? fundingCycle.number.toNumber() + 1 : undefined
  }, [fundingCycle?.number, type])

  const upcomingCycleLength = useMemo(() => {
    if (!upcomingFundingCycle) return
    return timeSecondsToDateString(
      upcomingFundingCycle.duration.toNumber(),
      'short',
    )
  }, [upcomingFundingCycle])

  const status = useMemo(() => {
    const duration =
      type === 'current'
        ? fundingCycle?.duration
        : upcomingFundingCycle?.duration
    if (!duration) return
    if (duration.isZero()) return t`Open`
    return t`Locked`
  }, [fundingCycle?.duration, type, upcomingFundingCycle?.duration])

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
  }
}
