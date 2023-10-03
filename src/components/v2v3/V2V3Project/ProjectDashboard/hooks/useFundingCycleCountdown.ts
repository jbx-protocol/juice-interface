import { useContext } from 'react'
import { FundingCycleCountdownContext } from '../components/FundingCycleCountdown/FundingCycleCountdownProvider'

export const useFundingCycleCountdown = () =>
  useContext(FundingCycleCountdownContext)
