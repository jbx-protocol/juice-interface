import { RulesetCountdownContext } from 'packages/v4v5/contexts/RulesetCountdownProvider'
import { useContext } from 'react'

export const useRulesetCountdown = () =>
  useContext(RulesetCountdownContext)
