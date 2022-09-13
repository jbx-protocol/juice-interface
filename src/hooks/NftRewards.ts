import axios from 'axios'

import {
  ContractNftRewardTier,
  IPFSNftRewardTier,
  NftRewardTier,
} from 'models/nftRewardTier'
import { useQuery, UseQueryResult } from 'react-query'
import { decodeEncodedIPFSUri, ipfsCidUrl } from 'utils/ipfs'

import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint48 } from 'constants/numbers'
import { withHttps } from 'utils/externalLink'
import { formatWad } from 'utils/format/formatNumber'

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
  const maxSupply = contractNftRewardTier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY),
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : contractNftRewardTier.initialQuantity.toNumber()
  return {
    name: ipfsRewardTier.name,
    description: ipfsRewardTier.description,
    externalLink: withHttps(ipfsRewardTier.externalLink),
    contributionFloor: parseFloat(
      formatWad(contractNftRewardTier.contributionFloor) ?? '0',
    ),
    tierRank: index + 1,
    maxSupply,
    remainingSupply:
      contractNftRewardTier.remainingQuantity.toNumber() ?? maxSupply,
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
