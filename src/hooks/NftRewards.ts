import { BigNumber } from '@ethersproject/bignumber'
import axios from 'axios'
import { ONE_BILLION } from 'constants/numbers'
import {
  IPFSNftRewardTier,
  JB721TierParams,
  NftRewardTier,
} from 'models/nftRewardTier'
import { useQuery, UseQueryResult } from 'react-query'
import { withHttps } from 'utils/externalLink'
import { formatWad } from 'utils/format/formatNumber'
import { decodeEncodedIPFSUri, openIpfsUrl } from 'utils/ipfs'

export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1

export async function fetchRewardTierFromIPFS({
  tier,
  index,
}: {
  tier: JB721TierParams
  index: number
}): Promise<NftRewardTier> {
  const tierCid = decodeEncodedIPFSUri(tier.encodedIPFSUri)
  const url = openIpfsUrl(tierCid)

  const response = await axios.get(url)
  const tierMetadata: IPFSNftRewardTier = response.data

  const maxSupply = tier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY),
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : tier.initialQuantity.toNumber()

  return {
    id: tier.id?.toNumber(),
    name: tierMetadata.name,
    description: tierMetadata.description,
    externalLink: withHttps(tierMetadata.externalLink),
    contributionFloor: parseFloat(formatWad(tier.contributionFloor) ?? '0'),
    tierRank: index + 1,
    maxSupply,
    remainingSupply: tier.remainingQuantity?.toNumber() ?? maxSupply,
    imageUrl: tierMetadata.image,
  }
}

// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)
// Returns an array of NftRewardTiers
export default function useNftRewards(
  tiers: JB721TierParams[],
  projectId: number | undefined,
  dataSourceAddress: string | undefined,
): UseQueryResult<NftRewardTier[]> {
  const hasTiers = Boolean(tiers?.length)

  return useQuery(
    ['nft-rewards', projectId, dataSourceAddress],
    async () => {
      if (!hasTiers) {
        return
      }

      return await Promise.all(
        tiers.map((tier, index) =>
          fetchRewardTierFromIPFS({
            tier,
            index,
          }),
        ),
      )
    },
    { enabled: hasTiers },
  )
}
