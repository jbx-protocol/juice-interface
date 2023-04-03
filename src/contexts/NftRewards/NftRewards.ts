import { BigNumber } from '@ethersproject/bignumber'
import axios from 'axios'
import { ONE_BILLION } from 'constants/numbers'
import { formatEther } from '@ethersproject/units'
import { IPFSNftRewardTier, JB721Tier, NftRewardTier } from 'models/nftRewards'
import { useQuery, UseQueryResult } from 'react-query'
import { withHttps } from 'utils/externalLink'
import { decodeEncodedIpfsUri, ipfsGatewayUrl } from 'utils/ipfs'

export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1

async function fetchRewardTierMetadata({
  tier,
}: {
  tier: JB721Tier
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

  return {
    id: tier.id.toNumber(),
    name: tierMetadata.name,
    description: tierMetadata.description,
    externalLink: withHttps(tierMetadata.externalLink),
    contributionFloor: Number(formatEther(tier.contributionFloor)) ?? 0,
    maxSupply,
    remainingSupply: tier.remainingQuantity?.toNumber() ?? maxSupply,
    fileUrl: tierMetadata.image,
    beneficiary: tier.reservedTokenBeneficiary,
    reservedRate: tier.reservedRate.toNumber(),
    votingWeight: tier.votingUnits.toNumber(),
  }
}

// Retreives each NftRewardTier from IPFS given an array of CIDs (IpfsHashes)
// Returns an array of NftRewardTiers
export default function useNftRewards(
  tiers: JB721Tier[],
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
        tiers.map(tier =>
          fetchRewardTierMetadata({
            tier,
          }),
        ),
      )
    },
    { enabled: hasTiers },
  )
}
