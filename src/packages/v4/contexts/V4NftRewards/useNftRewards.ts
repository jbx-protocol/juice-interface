import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { IPFSNftRewardTier, NftRewardTier } from 'models/nftRewards'
import {
  cidFromUrl,
  decodeEncodedIpfsUri,
  ethSucksGatewayUrl,
  ipfsGatewayUrl,
  pinataGatewayUrl
} from 'utils/ipfs'

import axios from 'axios'
import { formatEther } from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'
import { withHttps } from 'utils/externalLink'
import { JB721TierV4 } from './V4NftRewardsProvider'

// fetchRewardTierMetadata takes three steps to retrieve and process metadata:
// 1. Attempt to fetch metadata from the primary eth.sucks gateway.
// 2. If the primary gateway fails, fallback to the Infura (jbm.infura-ipfs) gateway, and then to the Pinata gateway.
// 3. Process the retrieved metadata (e.g., handle image URLs, format data) and return the reward tier details.
async function fetchRewardTierMetadata({ tier }: { tier: JB721TierV4 }) {
  const tierCid = decodeEncodedIpfsUri(tier.encodedIPFSUri)
  const primaryUrl = ethSucksGatewayUrl(tierCid) // Use eth.sucks as primary
  
  try {
    // First try the eth.sucks gateway (primary)
    const response = await axios.get(primaryUrl)
    const tierMetadata: IPFSNftRewardTier = response.data

    const maxSupply = tier.initialSupply

    // Some projects have image links hard-coded to the old IPFS gateway.
    const pinataRegex = /^(https?:\/\/jbx\.mypinata\.cloud)/
    const infuraRegex = /^(https?:\/\/jbm\.infura-ipfs\.io\/ipfs\/)/
    
    if (tierMetadata?.image && pinataRegex.test(tierMetadata.image)) {
      const imageUrlCid = cidFromUrl(tierMetadata.image)
      tierMetadata.image = ethSucksGatewayUrl(imageUrlCid) // Use eth.sucks for images too
    } else if (tierMetadata?.image && infuraRegex.test(tierMetadata.image)) {
      const imageUrlCid = cidFromUrl(tierMetadata.image)
      tierMetadata.image = ethSucksGatewayUrl(imageUrlCid) // Convert Infura URLs to eth.sucks
    }

    const rawContributionFloor = tier.price

    return processMetadata(tier, tierMetadata, maxSupply, rawContributionFloor)
  } catch (error) {
    console.warn(`eth.sucks gateway failed for CID ${tierCid}, trying Infura fallback`)
    
    try {
      // Try the jbm-Infura gateway as first fallback
      const infuraUrl = ipfsGatewayUrl(tierCid) 
      const response = await axios.get(infuraUrl)
      const tierMetadata: IPFSNftRewardTier = response.data
      const maxSupply = tier.initialSupply
      const rawContributionFloor = tier.price

      // Handle Pinata and Infura image links
      const pinataRegex = /^(https?:\/\/jbx\.mypinata\.cloud)/
      const infuraRegex = /^(https?:\/\/jbm\.infura-ipfs\.io\/ipfs\/)/
      
      if (tierMetadata?.image && pinataRegex.test(tierMetadata.image)) {
        const imageUrlCid = cidFromUrl(tierMetadata.image)
        tierMetadata.image = ethSucksGatewayUrl(imageUrlCid) // Still prefer eth.sucks for images
      } else if (tierMetadata?.image && infuraRegex.test(tierMetadata.image)) {
        const imageUrlCid = cidFromUrl(tierMetadata.image)
        tierMetadata.image = ethSucksGatewayUrl(imageUrlCid) // Convert Infura URLs to eth.sucks
      }

      return processMetadata(tier, tierMetadata, maxSupply, rawContributionFloor)
    } catch (infuraError) {
      console.warn(`Infura gateway failed for CID ${tierCid}, trying Pinata fallback`)
      
      try {
        // Try the Pinata gateway as final fallback
        const pinataUrl = pinataGatewayUrl(tierCid)
        const response = await axios.get(pinataUrl)
        const tierMetadata: IPFSNftRewardTier = response.data
        const maxSupply = tier.initialSupply
        const rawContributionFloor = tier.price

        // Handle Pinata and Infura image links
        const pinataRegex = /^(https?:\/\/jbx\.mypinata\.cloud)/
        const infuraRegex = /^(https?:\/\/jbm\.infura-ipfs\.io\/ipfs\/)/
        
        if (tierMetadata?.image && pinataRegex.test(tierMetadata.image)) {
          const imageUrlCid = cidFromUrl(tierMetadata.image)
          tierMetadata.image = ethSucksGatewayUrl(imageUrlCid) // Still prefer eth.sucks for images
        } else if (tierMetadata?.image && infuraRegex.test(tierMetadata.image)) {
          const imageUrlCid = cidFromUrl(tierMetadata.image)
          tierMetadata.image = ethSucksGatewayUrl(imageUrlCid) // Convert Infura URLs to eth.sucks
        }

        return processMetadata(tier, tierMetadata, maxSupply, rawContributionFloor)
      } catch (pinataError) {
        // If all gateways fail, rethrow the original error
        console.error(`All IPFS gateways failed for CID ${tierCid}`)
        throw error
      }
    }
  }
}

// Helper function to process metadata and return the reward tier
function processMetadata(
  tier: JB721TierV4, 
  tierMetadata: IPFSNftRewardTier, 
  maxSupply: number,
  rawContributionFloor: bigint
) {
  return {
    id: tier.id,
    name: tierMetadata.name,
    description: tierMetadata.description,
    externalLink: withHttps(tierMetadata.externalLink),
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
