import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { formatEther, jb721TiersHookStoreAbi } from 'juice-sdk-core'
import { readContract } from 'wagmi/actions'
import { IPFSNftRewardTier, NftRewardTier } from 'models/nftRewards'
import { decodeEncodedIpfsUri } from 'utils/ipfs'

import axios from 'axios'
import { JBChainId } from 'juice-sdk-react'
import { withHttps } from 'utils/externalLink'
import { zeroAddress } from 'viem'
import { useConfig } from 'wagmi'
import { JB721TierV4 } from './V4V5NftRewardsProvider'
import { fetchTierMetadata, liveMediaUrl } from './tierMedia'

const NFT_PAGE_SIZE = 100n

async function fetchRewardTierMetadata({
  tier,
  perChainSupply,
}: {
  tier: JB721TierV4
  perChainSupply?: { chainId: number; remainingSupply: number }[]
}) {
  const tierCid = decodeEncodedIpfsUri(tier.encodedIPFSUri)
  const tierMetadata = await fetchTierMetadata(tierCid)

  if (tierMetadata.image) {
    tierMetadata.image = liveMediaUrl(tierMetadata.image)
  }

  return processMetadata(
    tier,
    tierMetadata,
    tier.initialSupply,
    tier.price,
    perChainSupply,
  )
}

// Helper function to process metadata and return the reward tier
function processMetadata(
  tier: JB721TierV4, 
  tierMetadata: IPFSNftRewardTier, 
  maxSupply: number,
  rawContributionFloor: bigint,
  perChainSupply?: { chainId: number; remainingSupply: number }[]
) {
  const totalRemainingSupply = perChainSupply?.reduce((acc, chain) => acc + chain.remainingSupply, 0) ?? tier.remainingSupply

  return {
    id: tier.id,
    name: tierMetadata.name,
    description: tierMetadata.description,
    externalLink: withHttps(tierMetadata.externalLink),
    contributionFloor: formatEther(rawContributionFloor),
    maxSupply,
    remainingSupply: totalRemainingSupply,
    perChainSupply,
    fileUrl: tierMetadata.image,
    beneficiary: tier.reserveBeneficiary,
    reservedRate: tier.reserveFrequency,
    votingWeight: tier.votingUnits,
  }
}

export const useNftRewards = (
  tiers: readonly JB721TierV4[],
  projectChains: number[],
  projectId: bigint | undefined,
  chainId: JBChainId | undefined,
  dataSourceAddress: string | undefined,
  dataHookAddress: `0x${string}` | undefined,
): UseQueryResult<NftRewardTier[]> => {
  const config = useConfig()
  const enabled = Boolean(tiers?.length && dataSourceAddress)
  
  return useQuery({
    queryKey: ['nftRewards', projectId?.toString(), chainId, dataSourceAddress, projectChains],
    enabled,
    queryFn: async () => {
      if (!dataSourceAddress || !dataHookAddress) return []
      
      // Fetch tiers from all chains for supply aggregation
      const allChainTiersData = await Promise.all(
        projectChains.map(async currentChainId => {
          try {
            const chainTiers = await readContract(config, {
              abi: jb721TiersHookStoreAbi,
              address: dataSourceAddress as `0x${string}`,
              functionName: 'tiersOf',
              args: [
                dataHookAddress ?? zeroAddress as `0x${string}`,
                [], // _categories
                false, // _includeResolvedUri
                0n, // _startingId
                NFT_PAGE_SIZE, // limit
              ],
              chainId: currentChainId
            })
            
            return {
              chainId: currentChainId,
              tiers: chainTiers
            }
          } catch (error) {
            console.warn(`Failed to fetch tiers for chain ${currentChainId}:`, error)
            return {
              chainId: currentChainId,
              tiers: []
            }
          }
        })
      )

      // Aggregate supply data from all chains
      const aggregatedTiers = tiers.map(tier => {
        const perChainSupply = projectChains.map(currentChainId => {
          const chainTiersData = allChainTiersData.find(chainData => 
            chainData.chainId === currentChainId
          )?.tiers
          
          const matchingTier = chainTiersData?.find((chainTier: JB721TierV4) => 
            chainTier.id === tier.id
          )
          
          return {
            chainId: currentChainId,
            remainingSupply: matchingTier?.remainingSupply || 0
          }
        })

        return { tier, perChainSupply }
      })

      return await Promise.all(
        aggregatedTiers.map(({ tier, perChainSupply }) => 
          fetchRewardTierMetadata({ tier, perChainSupply })
        ),
      )
    },
  })
}
