import { Nft } from 'generated/graphql'
import { NftRewardTier } from 'models/nftRewards'
import {
  NFT_METADATA_CONTRIBUTION_FLOOR_ATTRIBUTES_INDEX,
  useJB721DelegateTokenMetadata,
} from 'packages/v2v3/components/V2V3Project/ManageNftsSection/RedeemNftsModal/RedeemNftCard'
import { UseQueryResult } from 'react-query'

export type RedeemingNft = Pick<Nft, 'tokenUri'> & {
  tokenId: string
}

export function useJB721DelegateTokenToNftReward(
  nft: RedeemingNft,
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
