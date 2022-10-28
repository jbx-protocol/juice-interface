import {
  NftCollectionMetadata,
  NftPostPayModalConfig,
  NftRewardTier,
} from 'models/nftRewardTier'
import { createContext } from 'react'
import { EMPTY_NFT_COLLECTION_METADATA } from 'redux/slices/editingV2Project'

type NftRewardsContextType = {
  nftRewards: {
    CIDs: string[] | undefined
    rewardTiers: NftRewardTier[] | undefined
    postPayModal: NftPostPayModalConfig | undefined
    collectionMetadata: NftCollectionMetadata
    loading: boolean | undefined
  }
}

export const NftRewardsContext = createContext<NftRewardsContextType>({
  nftRewards: {
    CIDs: undefined,
    rewardTiers: undefined,
    postPayModal: undefined,
    collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    loading: undefined,
  },
})
