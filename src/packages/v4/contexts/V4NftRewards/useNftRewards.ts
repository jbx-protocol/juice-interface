import { useQuery, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'
import { formatEther } from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'
import { IPFSNftRewardTier, NftRewardTier } from 'models/nftRewards'
import { withHttps } from 'utils/externalLink'
import { cidFromUrl, decodeEncodedIpfsUri, ipfsGatewayUrl } from 'utils/ipfs'
import { JB721TierV4 } from './V4NftRewardsProvider'

async function fetchRewardTierMetadata({ tier }: { tier: JB721TierV4 }) {
  const tierCid = decodeEncodedIpfsUri(tier.encodedIPFSUri)
  const url = ipfsGatewayUrl(tierCid)

  const response = await axios.get(url)
  const tierMetadata: IPFSNftRewardTier = response.data

  const maxSupply = tier.initialSupply

  // Some projects have image links hard-coded to the old IPFS gateway.
  const pinataRegex = /^(https?:\/\/jbx\.mypinata\.cloud)/
  if (tierMetadata?.image && pinataRegex.test(tierMetadata.image)) {
    const imageUrlCid = cidFromUrl(tierMetadata.image)
    tierMetadata.image = ipfsGatewayUrl(imageUrlCid)
  }

  const rawContributionFloor = tier.price

  return {
    id: tier.id,
    name: tierMetadata.name,
    description: tierMetadata.description,
    externalLink: withHttps(tierMetadata.externalLink),
    // convert rawContributionFloor bigint to a number
    contributionFloor: formatEther(rawContributionFloor),
    maxSupply,
    remainingSupply: tier.remainingSupply,
    fileUrl: tierMetadata.image,
    beneficiary: tier.reserveBeneficiary,
    reservedRate: tier.reserveFrequency,
    votingWeight: tier.votingUnits,
  }
}

export const useNftRewards = (
  tiers: readonly JB721TierV4[],
  projectId: bigint | undefined,
  chainId: JBChainId | undefined,
  dataSourceAddress: string | undefined,
): UseQueryResult<NftRewardTier[]> => {
  const enabled = Boolean(tiers?.length)

  return useQuery({
    queryKey: ['nftRewards', projectId?.toString(), chainId, dataSourceAddress],
    enabled,
    queryFn: async () => {
      return await Promise.all(
        tiers.map(tier => fetchRewardTierMetadata({ tier })),
      )
    },
  })
}
