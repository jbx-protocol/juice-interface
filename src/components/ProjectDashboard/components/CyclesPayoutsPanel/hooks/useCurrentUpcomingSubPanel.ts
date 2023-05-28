import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { timeSecondsToDateString } from 'components/ProjectDashboard/utils/timeSecondsToDateString'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { useEffect, useMemo, useState } from 'react'

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
  const [remainingTime, setRemainingTime] = useState<string>('')

  const cycleNumber = useMemo(() => {
    if (type === 'current') {
      return fundingCycle?.number.toNumber()
    }
    return fundingCycle?.number ? fundingCycle.number.toNumber() + 1 : undefined
  }, [fundingCycle?.number, type])

  /**
   * Update the remaining time every second.
   */
  useEffect(() => {
    if (!fundingCycle || type !== 'current') return
    const fn = () => {
      if (!fundingCycle) return
      const now = Date.now() / 1000
      const end = fundingCycle.start.add(fundingCycle.duration).toNumber()
      const remaining = end - now > 0 ? end - now : 0
      setRemainingTime(timeSecondsToDateString(remaining))
    }
    fn()
    const timer = setInterval(fn, 1000)
    return () => clearInterval(timer)
  }, [fundingCycle, type])

  const upcomingCycleLength = useMemo(() => {
    if (!upcomingFundingCycle) return
    return timeSecondsToDateString(
      upcomingFundingCycle.duration.toNumber(),
      'short',
    )
  }, [upcomingFundingCycle])

  const status = useMemo(() => {
    // TODO: replace with real data
    return 'Locked'
  }, [])

  // Short circuit current for faster loading
  if (type === 'current') {
    if (fundingCycleLoading) return { loading: true, type }
    return {
      loading: false,
      type,
      cycleNumber,
      status,
      remainingTime,
      // TODO: replace with real data
      cycleConfiguration: {},
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
    cycleConfiguration: {},
  }
}
