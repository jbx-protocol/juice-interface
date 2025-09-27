import { RulesetCountdownContext } from 'packages/v4/contexts/RulesetCountdownProvider'
import { useContext } from 'react'

export const useRulesetCountdown = () =>
  useContext(RulesetCountdownContext)
