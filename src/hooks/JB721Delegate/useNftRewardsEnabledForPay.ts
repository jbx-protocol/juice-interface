import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext, useMemo } from 'react'
import { hasDataSourceForPay } from 'utils/v2v3/fundingCycle'

export function useNftRewardsEnabledForPay() {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)
  const hasNftRewards = useMemo(() => rewardTiers?.length !== 0, [rewardTiers])

  return hasNftRewards && hasDataSourceForPay(fundingCycleMetadata)
}
