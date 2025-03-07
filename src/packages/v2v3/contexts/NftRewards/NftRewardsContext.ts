import { JB721GovernanceType } from 'models/nftRewards'
import { createContext } from 'react'
import {
  DEFAULT_NFT_FLAGS,
  DEFAULT_NFT_PRICING,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/v2v3/shared/v2ProjectDefaultState'
import { NftRewardsData } from 'redux/slices/v2v3/shared/v2ProjectTypes'

type NftRewardsContextType = {
  nftRewards: NftRewardsData
  loading: boolean | undefined
}

export const NftRewardsContext = createContext<NftRewardsContextType>({
  nftRewards: {
    CIDs: undefined,
    rewardTiers: undefined,
    postPayModal: undefined,
    collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    flags: DEFAULT_NFT_FLAGS,
    governanceType: JB721GovernanceType.NONE,
    pricing: DEFAULT_NFT_PRICING,
  },
  loading: false,
})
