import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/splits'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useProjectSplits from 'hooks/v2v3/contractReader/useProjectSplits'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'

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
