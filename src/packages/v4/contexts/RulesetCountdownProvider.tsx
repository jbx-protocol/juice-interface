import { useCountdownClock } from 'components/Project/hooks/useCountdownClock'
import { useJBRuleset } from 'juice-sdk-react'
import { createContext } from 'react'

type RulesetCountdownContextType = {
  timeRemainingText: string
  endEpochSeconds: number
  secondsRemaining: number
}

export const RulesetCountdownContext =
  createContext<RulesetCountdownContextType>({
    timeRemainingText: '0d 0h 0m 0s',
    endEpochSeconds: 0,
    secondsRemaining: 0,
  })

export const RulesetCountdownProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { data: ruleset } = useJBRuleset()

  const endEpochSeconds = ruleset
    ? Number(ruleset.start + ruleset.duration)
    : 0

  const { remainingTimeText, secondsRemaining } =
    useCountdownClock(endEpochSeconds)

  return (
    <RulesetCountdownContext.Provider
      value={{
        timeRemainingText: remainingTimeText,
        endEpochSeconds,
        secondsRemaining,
      }}
    >
      {children}
    </RulesetCountdownContext.Provider>
  )
}
