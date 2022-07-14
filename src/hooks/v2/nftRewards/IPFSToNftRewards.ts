import axios from 'axios'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useQuery, UseQueryResult } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

async function getRewardTierOfCid(cid: string) {
  const url = ipfsCidUrl(cid)
  const response = await axios.get(url)
  return response.data
}

// Calls a cloudfunction to upload to IPFS created by @tankbottoms
// Returns cid which points to where this NFT data is stored on IPFS
export default function useNftRewards(
  CIDs: string[] | undefined,
): UseQueryResult<NftRewardTier[]> {
  return useQuery('nft-rewards', async () => {
    if (!CIDs?.length) {
      return
    }

    console.info('>>> Retreiving reward tiers from IPFS using CIDs: ', CIDs)
    const getRewardTiers = async () => {
      return Promise.all(CIDs.map(cid => getRewardTierOfCid(cid)))
    }

    getRewardTiers().then((rewardTiers: NftRewardTier[]) => {
      console.info('>>> IPFS returned reward tiers: ', rewardTiers)
      return rewardTiers
    })
    return getRewardTiers()
  })
}
