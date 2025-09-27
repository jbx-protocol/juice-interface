import { useV4V5CurrentPayoutSplits } from 'packages/v4v5/hooks/useV4V5CurrentPayoutSplits'
import { useV4V5UpcomingPayoutSplits } from 'packages/v4v5/hooks/useV4V5UpcomingPayoutSplits'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'

export const useV4V5CurrentUpcomingPayoutSplits = (
  type: 'current' | 'upcoming',
) => {
  const { selectedChainId } = useCyclesPanelSelectedChain()
  
  const { data: currentSplits, isLoading: currentSplitsLoading } =
    useV4V5CurrentPayoutSplits(selectedChainId)

  const { data: upcomingSplits, isLoading: upcomingSplitsLoading } = useV4V5UpcomingPayoutSplits(selectedChainId)

  if (type === 'current') {
    return { splits: currentSplits, isLoading: currentSplitsLoading }
  }

  return {
    splits: upcomingSplits,
    isLoading: upcomingSplitsLoading,
  }
}
