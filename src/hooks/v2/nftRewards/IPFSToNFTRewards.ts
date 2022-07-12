import axios from 'axios'
import { NFTRewardTier } from 'models/v2/nftRewardTier'
import { useQuery } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

import { CloudFunctionRewardTier } from './NFTRewardsToIPFS'

function transformNftRewardsData(
  data: CloudFunctionRewardTier[],
): NFTRewardTier[] {
  const nftRewardTiers: NFTRewardTier[] = []
  data.map((rewardTier: CloudFunctionRewardTier) => {
    nftRewardTiers.push({
      name: rewardTier.name,
      description: rewardTier.description ?? '',
      externalLink: rewardTier.uri,
      imageUrl: rewardTier.image,
      paymentThreshold: rewardTier.attributes_tiers,
      maxSupply: rewardTier.attributes_supply,
      rights: '',
    } as NFTRewardTier)
  })

  return nftRewardTiers
}

// Calls a cloudfunction to upload to IPFS created by @tankbottoms
// Returns cid which points to where this NFT data is stored on IPFS
export default function useNFTRewards(cid: string | undefined) {
  return useQuery('nft-rewards', async () => {
    if (!cid) {
      return
    }
    const url = ipfsCidUrl(cid)
    const response = await axios.get(url)
    return transformNftRewardsData(response.data)
  })
}
