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
  return useQuery(
    'nft-rewards',
    async () => {
      if (!CIDs?.length) {
        return
      }

      return await Promise.all(CIDs.map(cid => getRewardTierOfCid(cid)))
    },
    { enabled: !!CIDs?.length },
  )
}
