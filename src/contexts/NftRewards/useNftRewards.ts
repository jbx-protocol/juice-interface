import axios from 'axios'
import { DEFAULT_NFT_MAX_SUPPLY } from 'constants/nftRewards'
import { BigNumber } from 'ethers'
import {
  IPFSNftRewardTier,
  JB721TierV3,
  JB_721_TIER_V3_2,
  NftRewardTier,
} from 'models/nftRewards'
import { UseQueryResult, useQuery } from 'react-query'
import { withHttps } from 'utils/externalLink'
import { formatWad } from 'utils/format/formatNumber'
import { cidFromUrl, decodeEncodedIpfsUri, ipfsGatewayUrl } from 'utils/ipfs'

async function fetchRewardTierMetadata({
  tier,
}: {
  tier: JB721TierV3 | JB_721_TIER_V3_2
}): Promise<NftRewardTier> {
  const tierCid = decodeEncodedIpfsUri(tier.encodedIPFSUri)
  const url = ipfsGatewayUrl(tierCid)

  const response = await axios.get(url)
  const tierMetadata: IPFSNftRewardTier = response.data

  const maxSupply = tier.initialQuantity.eq(
    BigNumber.from(DEFAULT_NFT_MAX_SUPPLY),
  )
    ? DEFAULT_NFT_MAX_SUPPLY
    : tier.initialQuantity.toNumber()

  // Some projects have image links hard-coded to the old IPFS gateway.
  const pinataRegex = /^(https?:\/\/jbx\.mypinata\.cloud)/
  if (tierMetadata?.image && pinataRegex.test(tierMetadata.image)) {
    const imageUrlCid = cidFromUrl(tierMetadata.image)
    tierMetadata.image = ipfsGatewayUrl(imageUrlCid)
  }

  const rawContributionFloor =
    (tier as JB_721_TIER_V3_2).price ?? (tier as JB721TierV3).contributionFloor

  return {
    id: tier.id.toNumber(),
    name: tierMetadata.name,
    description: tierMetadata.description,
    externalLink: withHttps(tierMetadata.externalLink),
    contributionFloor: parseFloat(formatWad(rawContributionFloor) ?? '0'),
    maxSupply,
    remainingSupply: tier.remainingQuantity?.toNumber() ?? maxSupply,
    fileUrl: tierMetadata.image,
    beneficiary: tier.reservedTokenBeneficiary,
    reservedRate: tier.reservedRate.toNumber(),
    votingWeight: tier.votingUnits.toString(),
  }
}

// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)
// Returns an array of NftRewardTiers
export default function useNftRewards(
  tiers: JB721TierV3[] | JB_721_TIER_V3_2[],
  projectId: number | undefined,
  dataSourceAddress: string | undefined,
): UseQueryResult<NftRewardTier[]> {
  const enabled = Boolean(tiers?.length)

  return useQuery(
    ['nft-rewards', projectId, dataSourceAddress, enabled],
    async () => {
      if (!enabled) {
        return
      }

      return await Promise.all(
        tiers.map(tier =>
          fetchRewardTierMetadata({
            tier,
          }),
        ),
      )
    },
    { enabled: enabled },
  )
}
