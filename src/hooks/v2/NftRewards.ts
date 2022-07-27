import axios from 'axios'

import { IPFSNftRewardTier, NftRewardTier } from 'models/v2/nftRewardTier'
import { useQuery, UseQueryResult } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

import { MaxUint48 } from 'constants/numbers'

const DEFAULT_NFT_MAX_SUPPLY = MaxUint48

async function getRewardTierOfCid(cid: string): Promise<NftRewardTier> {
  const url = ipfsCidUrl(cid)
  const response = await axios.get(url)
  const ipfsRewardTier: IPFSNftRewardTier = response.data
  return {
    name: ipfsRewardTier.name,
    description: ipfsRewardTier.description,
    externalLink: ipfsRewardTier.externalLink,
    contributionFloor: ipfsRewardTier.attributes.contributionFloor,
    maxSupply: ipfsRewardTier.attributes.maxSupply ?? DEFAULT_NFT_MAX_SUPPLY,
    imageUrl: ipfsRewardTier.image,
  }
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
