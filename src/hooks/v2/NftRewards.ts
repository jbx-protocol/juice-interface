import axios from 'axios'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useQuery, UseQueryResult } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

async function getRewardTierOfCid(cid: string) {
  const url = ipfsCidUrl(cid)
  const response = await axios.get(url)
  return response.data
}

// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)
// Returns an array of NftRewardTiers
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
