import { useFundingCycleCountdown } from './useFundingCycleCountdown'

export const useCurrentCycleCard = () => {
  const { timeRemainingText } = useFundingCycleCountdown()
  return {
    currentCycleNumber: 21,
    timeRemainingText,
  }
}
