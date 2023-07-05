import { useFundingCycleCountdown } from './useFundingCycleCountdown'
import { useProjectContext } from './useProjectContext'

export const useCurrentCycleCard = () => {
  const { timeRemainingText } = useFundingCycleCountdown()
  const { fundingCycle } = useProjectContext()
  const isUnlocked = fundingCycle?.duration?.isZero() ?? true
  return {
    currentCycleNumber: fundingCycle?.number.toNumber() ?? 0,
    timeRemainingText,
    isUnlocked,
  }
}
