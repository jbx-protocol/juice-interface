import { useCountdownClock } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useCountdownClock'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { createContext } from 'react'

type FundingCycleCountdownContextType = {
  timeRemainingText: string
  endEpochSeconds: number
  secondsRemaining: number
}

export const FundingCycleCountdownContext =
  createContext<FundingCycleCountdownContextType>({
    timeRemainingText: '0d 0h 0m 0s',
    endEpochSeconds: 0,
    secondsRemaining: 0,
  })

export const FundingCycleCountdownProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const fundingCycle = useProjectContext().fundingCycle

  const endEpochSeconds = fundingCycle
    ? fundingCycle.start.add(fundingCycle.duration).toNumber()
    : 0

  const { remainingTimeText, secondsRemaining } =
    useCountdownClock(endEpochSeconds)
  return (
    <FundingCycleCountdownContext.Provider
      value={{
        timeRemainingText: remainingTimeText,
        endEpochSeconds,
        secondsRemaining,
      }}
    >
      {children}
    </FundingCycleCountdownContext.Provider>
  )
}
