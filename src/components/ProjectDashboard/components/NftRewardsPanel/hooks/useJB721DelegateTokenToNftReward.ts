import {
  NFT_METADATA_CONTRIBUTION_FLOOR_ATTRIBUTES_INDEX,
  useJB721DelegateTokenMetadata,
} from 'components/v2v3/V2V3Project/ManageNftsSection/RedeemNftsModal/RedeemNftCard'
import { NftRewardTier } from 'models/nftRewards'
import { JB721DelegateToken } from 'models/subgraph-entities/v2/jb-721-delegate-tokens'
import { UseQueryResult } from 'react-query'

export function useJB721DelegateTokenToNftReward(
  nft: Pick<JB721DelegateToken, 'address' | 'tokenId' | 'tokenUri'>,
): UseQueryResult<NftRewardTier> {
  const { data: tierData } = useJB721DelegateTokenMetadata(nft.tokenUri)
  const contributionFloor =
    tierData?.attributes[NFT_METADATA_CONTRIBUTION_FLOOR_ATTRIBUTES_INDEX]
      .value ?? 0

  return {
    data: tierData
      ? {
          name: tierData.name,
          contributionFloor,
          id: parseInt(nft.tokenId),
          remainingSupply: undefined,
          maxSupply: undefined,
          fileUrl: tierData.image,
          externalLink: undefined,
          description: undefined,
          beneficiary: undefined,
          reservedRate: undefined,
          votingWeight: undefined,
        }
      : undefined,
    isLoading: false,
    error: undefined,
  } as UseQueryResult<NftRewardTier>
}
