import { useV4CurrentPayoutSplits } from 'packages/v4/hooks/useV4CurrentPayoutSplits'
import { useV4UpcomingPayoutSplits } from 'packages/v4/hooks/useV4UpcomingPayoutSplits'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'

export const useV4CurrentUpcomingPayoutSplits = (
  type: 'current' | 'upcoming',
) => {
  const { selectedChainId } = useCyclesPanelSelectedChain()
  
  const { data: currentSplits, isLoading: currentSplitsLoading } =
    useV4CurrentPayoutSplits(selectedChainId)

  const { data: upcomingSplits, isLoading: upcomingSplitsLoading } = useV4UpcomingPayoutSplits(selectedChainId)

  if (type === 'current') {
    return { splits: currentSplits, isLoading: currentSplitsLoading }
  }

  return {
    splits: upcomingSplits,
    isLoading: upcomingSplitsLoading,
  }
}
