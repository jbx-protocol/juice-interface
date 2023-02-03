import axios from 'axios'
import {
  IPFSNftRewardTier,
  NftRewardTier,
  NFT_METADATA_CONTRIBUTION_FLOOR_ATTRIBUTES_INDEX,
} from 'models/nftRewardTier'
import { JB721DelegateToken } from 'models/subgraph-entities/v2/jb-721-delegate-tokens'
import { useQuery, UseQueryResult } from 'react-query'
import { cidFromIpfsUri, openIpfsUrl } from 'utils/ipfs'
import { NftTierCard } from 'components/NftRewards/NftTierCard'

function useJB721DelegateTokenMetadata(
  tokenUri: string | undefined,
): UseQueryResult<IPFSNftRewardTier> {
  return useQuery(
    ['nft-rewards', tokenUri],
    async (): Promise<IPFSNftRewardTier | undefined> => {
      if (!tokenUri) return

      const url = openIpfsUrl(cidFromIpfsUri(tokenUri))
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
  nft: JB721DelegateToken
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
    remainingSupply: undefined,
    maxSupply: undefined,
    fileUrl: image,
    externalLink: undefined,
    description: undefined,
  }

  return (
    <NftTierCard
      rewardTier={rewardTier}
      onSelect={onClick}
      onDeselect={onRemove}
      maxQuantity={1}
      isSelected={isSelected}
      loading={loading}
      previewDisabled
      hideAttributes
    />
  )
}
