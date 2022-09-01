import axios from 'axios'

import {
  ContractNftRewardTier,
  IPFSNftRewardTier,
  NftRewardTier,
} from 'models/v2/nftRewardTier'
import { useQuery, UseQueryResult } from 'react-query'
import { decodeEncodedIPFSUri, ipfsCidUrl } from 'utils/ipfs'

import { MaxUint48 } from 'constants/numbers'
import { withHttps } from 'utils/externalLink'

export const DEFAULT_NFT_MAX_SUPPLY = MaxUint48

async function getRewardTierFromIPFS({
  contractNftRewardTier,
  index,
}: {
  contractNftRewardTier: ContractNftRewardTier
  index: number
}): Promise<NftRewardTier> {
  const url = ipfsCidUrl(
    decodeEncodedIPFSUri(contractNftRewardTier.encodedIPFSUri),
  )

  const response = await axios.get(url)
  const ipfsRewardTier: IPFSNftRewardTier = response.data
  return {
    name: ipfsRewardTier.name,
    description: ipfsRewardTier.description,
    externalLink: withHttps(ipfsRewardTier.externalLink),
    contributionFloor: ipfsRewardTier.attributes.contributionFloor,
    tierRank: index + 1,
    maxSupply: ipfsRewardTier.attributes.maxSupply ?? DEFAULT_NFT_MAX_SUPPLY,
    remainingSupply:
      contractNftRewardTier.remainingQuantity.toNumber() ??
      contractNftRewardTier.initialQuantity.toNumber(),
    imageUrl: ipfsRewardTier.image,
  }
}

// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)
// Returns an array of NftRewardTiers
export default function useNftRewards(
  contractNftRewardTiers: ContractNftRewardTier[],
): UseQueryResult<NftRewardTier[]> {
  return useQuery(
    'nft-rewards',
    async () => {
      if (!contractNftRewardTiers?.length) {
        return
      }

      return await Promise.all(
        contractNftRewardTiers.map((contractNftRewardTier, index) =>
          getRewardTierFromIPFS({
            contractNftRewardTier,
            index,
          }),
        ),
      )
    },
    { enabled: Boolean(contractNftRewardTiers?.length) },
  )
}
