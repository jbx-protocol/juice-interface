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
    collectionMetadata: NftCollectionMetadata
    postPayModal: NftPostPayModalConfig | undefined
    loading: boolean | undefined
  }
}

export const NftRewardsContext = createContext<NftRewardsContextType>({
  nftRewards: {
    CIDs: undefined,
    rewardTiers: undefined,
    collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    postPayModal: undefined,
    loading: undefined,
  },
})
