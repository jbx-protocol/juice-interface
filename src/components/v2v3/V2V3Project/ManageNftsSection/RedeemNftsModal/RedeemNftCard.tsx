import axios from 'axios'
import { NftTierCard } from 'components/NftRewards/NftTierCard'
import { RedeemingNft } from 'components/v2v3/V2V3Project/ProjectDashboard/components/NftRewardsPanel/hooks/useJB721DelegateTokenToNftReward'
import { IPFSNftRewardTier, NftRewardTier } from 'models/nftRewards'
import { UseQueryResult, useQuery } from 'react-query'
import { cidFromIpfsUri, ipfsGatewayUrl } from 'utils/ipfs'

export const NFT_METADATA_CONTRIBUTION_FLOOR_ATTRIBUTES_INDEX = 0

export function useJB721DelegateTokenMetadata(
  tokenUri: string | undefined,
): UseQueryResult<IPFSNftRewardTier> {
  return useQuery(
    ['nft-rewards', tokenUri],
    async (): Promise<IPFSNftRewardTier | undefined> => {
      if (!tokenUri) return

      const url = ipfsGatewayUrl(cidFromIpfsUri(tokenUri))
      const response = await axios.get(url)
      const tierMetadata: IPFSNftRewardTier = response.data

      return tierMetadata
    },
  )
}

export function RedeemNftCard({
  nft,
  isSelected,
  onClick,
  onRemove,
  loading,
}: {
  nft: RedeemingNft
  isSelected: boolean
  onClick: VoidFunction
  onRemove: VoidFunction
  loading?: boolean
}) {
  const { data: tierData } = useJB721DelegateTokenMetadata(nft.tokenUri)
  if (!tierData) return null

  const { name, image } = tierData
  const contributionFloor =
    tierData.attributes[NFT_METADATA_CONTRIBUTION_FLOOR_ATTRIBUTES_INDEX]
      .value ?? 0

  const rewardTier: NftRewardTier = {
    name,
    contributionFloor,
    id: parseInt(nft.tokenId),
    remainingSupply: undefined,
    maxSupply: undefined,
    fileUrl: image,
    externalLink: undefined,
    description: undefined,
    beneficiary: undefined,
    reservedRate: undefined,
    votingWeight: undefined,
  }

  return (
    <NftTierCard
      rewardTier={rewardTier}
      onSelect={onClick}
      onDeselect={onRemove}
      maxQuantity={1}
      isSelected={isSelected}
      loading={loading}
      hideAttributes
    />
  )
}
