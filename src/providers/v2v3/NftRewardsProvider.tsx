import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useNftCollectionMetadataUri } from 'hooks/JB721Delegate/contractReader/NftCollectionMetadataUri'
import { useNftRewardTiersOf } from 'hooks/JB721Delegate/contractReader/NftRewardTiersOf'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'
import useNftRewards from 'hooks/NftRewards'
import { JB721GovernanceType } from 'models/nftRewardTier'
import { useContext } from 'react'
import { EMPTY_NFT_COLLECTION_METADATA } from 'redux/slices/editingV2Project'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'

export const NftRewardsProvider: React.FC = ({ children }) => {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)

  const dataSourceAddress = fundingCycleMetadata?.dataSource
  // don't fetch stuff if there's no datasource in the first place.
  const shouldFetch = useHasNftRewards()

  /**
   * Load NFT Rewards data
   */
  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftRewardTiersOf({
      dataSourceAddress,
      shouldFetch,
    })
  // catchall to ensure nfts are never loaded if hasNftRewards is false (there's no datasource).
  const tierData = shouldFetch ? nftRewardTiersResponse ?? [] : []

  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tierData,
    projectId,
    dataSourceAddress,
  )

  const { data: collectionMetadataUri, loading: collectionUriLoading } =
    useNftCollectionMetadataUri(dataSourceAddress)

  const CIDs = CIDsOfNftRewardTiersResponse(tierData)

  // Assumes having `dataSource` means there are NFTs initially
  // In worst case, if has `dataSource` but isn't for NFTs:
  //    - loading will be true briefly
  //    - will resolve false when `useNftRewardTiersOf` fails

  const loading = Boolean(
    nftRewardTiersLoading || nftRewardsCIDsLoading || collectionUriLoading,
  )

  return (
    <NftRewardsContext.Provider
      value={{
        nftRewards: {
          rewardTiers,
          governanceType: JB721GovernanceType.NONE,
          CIDs,
          collectionMetadata: {
            ...EMPTY_NFT_COLLECTION_METADATA, // only load the metadata CID in the context - other data not necessary
            uri: collectionMetadataUri,
          },
          postPayModal: projectMetadata?.nftPaymentSuccessModal,
        },
        loading,
      }}
    >
      {children}
    </NftRewardsContext.Provider>
  )
}
