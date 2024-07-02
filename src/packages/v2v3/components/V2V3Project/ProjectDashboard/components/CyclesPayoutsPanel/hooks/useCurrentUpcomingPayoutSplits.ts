import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/splits'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import useProjectSplits from 'packages/v2v3/hooks/contractReader/useProjectSplits'
import { useProjectUpcomingFundingCycle } from 'packages/v2v3/hooks/contractReader/useProjectUpcomingFundingCycle'

export const useCurrentUpcomingPayoutSplits = (
  type: 'current' | 'upcoming',
) => {
  const { projectId } = useProjectMetadataContext()
  const { payoutSplits: currentPayoutSplits } = useProjectContext()

  const {
    data: upcomingFundingCycleData,
    loading: upcomingFundingCycleLoading,
  } = useProjectUpcomingFundingCycle({ projectId })
  const [upcomingFundingCycle] = upcomingFundingCycleData ?? []

  const { data: upcomingPayoutSplits, loading: upcomingProjectSplitsLoading } =
    useProjectSplits({
      projectId,
      splitGroup: ETH_PAYOUT_SPLIT_GROUP,
      domain: upcomingFundingCycle?.configuration?.toString(),
    })

  if (type === 'current') {
    return { splits: currentPayoutSplits, loading: false }
  }
  return {
    splits: upcomingPayoutSplits,
    loading: upcomingFundingCycleLoading || upcomingProjectSplitsLoading,
  }
}
