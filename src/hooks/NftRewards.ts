import axios from 'axios'

import {
  IPFSNftRewardTier,
  JB721TierParams,
  NftRewardTier,
} from 'models/nftRewardTier'
import { useQuery, UseQueryResult } from 'react-query'
import { decodeEncodedIPFSUri, restrictedIpfsUrl } from 'utils/ipfs'

import { BigNumber } from '@ethersproject/bignumber'
import { ONE_BILLION } from 'constants/numbers'
import { withHttps } from 'utils/externalLink'
import { formatWad } from 'utils/format/formatNumber'

export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1

async function getRewardTierFromIPFS({
  tier,
  index,
}: {
  tier: JB721TierParams
  index: number
}): Promise<NftRewardTier> {
  const url = restrictedIpfsUrl(decodeEncodedIPFSUri(tier.encodedIPFSUri))

  const response = await axios.get(url)
  const ipfsRewardTier: IPFSNftRewardTier = response.data
  const maxSupply = tier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY),
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : tier.initialQuantity.toNumber()
  return {
    id: tier.id?.toNumber(),
    name: ipfsRewardTier.name,
    description: ipfsRewardTier.description,
    externalLink: withHttps(ipfsRewardTier.externalLink),
    contributionFloor: parseFloat(formatWad(tier.contributionFloor) ?? '0'),
    tierRank: index + 1,
    maxSupply,
    remainingSupply: tier.remainingQuantity?.toNumber() ?? maxSupply,
    imageUrl: ipfsRewardTier.image,
  }
}

// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)
// Returns an array of NftRewardTiers
export default function useNftRewards(
  tiers: JB721TierParams[],
): UseQueryResult<NftRewardTier[]> {
  return useQuery(
    'nft-rewards',
    async () => {
      if (!tiers?.length) {
        return
      }

      return await Promise.all(
        tiers.map((tier, index) =>
          getRewardTierFromIPFS({
            tier,
            index,
          }),
        ),
      )
    },
    { enabled: Boolean(tiers?.length) },
  )
}
