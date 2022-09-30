import { NftRewardTier } from 'models/nftRewardTier'
import { createContext } from 'react'

export type NftRewardsContextType = {
  nftRewards: {
    CIDs: string[] | undefined
    rewardTiers: NftRewardTier[] | undefined
    loading: boolean | undefined
  }
}

export const NftRewardsContext = createContext<NftRewardsContextType>({
  nftRewards: {
    CIDs: undefined,
    rewardTiers: undefined,
    loading: undefined,
  },
})
