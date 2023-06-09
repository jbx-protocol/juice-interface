import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { useCountdownClock } from 'components/ProjectDashboard/hooks/useCountdownClock'
import { createContext } from 'react'

type FundingCycleCountdownContextType = {
  timeRemainingText: string
}

export const FundingCycleCountdownContext =
  createContext<FundingCycleCountdownContextType>({
    timeRemainingText: '0d 0h 0m 0s',
  })

export const FundingCycleCountdownProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const fundingCycle = useProjectContext().fundingCycle

  const endEpochSeconds = fundingCycle
    ? fundingCycle.start.add(fundingCycle.duration).toNumber()
    : undefined

  const remainingTimeText = useCountdownClock(endEpochSeconds)
  return (
    <FundingCycleCountdownContext.Provider
      value={{
        timeRemainingText: remainingTimeText,
      }}
    >
      {children}
    </FundingCycleCountdownContext.Provider>
  )
}
