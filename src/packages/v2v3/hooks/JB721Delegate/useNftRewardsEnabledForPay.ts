import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { hasDataSourceForPay } from 'packages/v2v3/utils/fundingCycle'
import { useContext, useMemo } from 'react'

export function useNftRewardsEnabledForPay() {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)
  const hasNftRewards = useMemo(() => rewardTiers?.length !== 0, [rewardTiers])

  return hasNftRewards && hasDataSourceForPay(fundingCycleMetadata)
}
