import useNftRewards from 'contexts/NftRewards/NftRewards'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftCollectionMetadataUri } from 'hooks/JB721Delegate/contractReader/NftCollectionMetadataUri'
import { useNftFlagsOf } from 'hooks/JB721Delegate/contractReader/NftFlagsOf'
import { useNftRewardTiersOf } from 'hooks/JB721Delegate/contractReader/NftRewardTiersOf'
import { useJB721DelegateVersion } from 'hooks/JB721Delegate/JB721DelegateVersion'
import { JB721GovernanceType } from 'models/nftRewardTier'
import { useContext } from 'react'
import {
  DEFAULT_NFT_FLAGS,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/editingV2Project'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'

export const NftRewardsProvider: React.FC = ({ children }) => {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)

  const dataSourceAddress = fundingCycleMetadata?.dataSource
  const contractVersion = useJB721DelegateVersion({
    dataSourceAddress,
  })

  // don't fetch stuff if there's no datasource in the first place.
  const hasNftRewards = Boolean(contractVersion)

  /**
   * Load NFT Rewards data
   */
  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftRewardTiersOf({
      dataSourceAddress,
      shouldFetch: hasNftRewards,
    })

  // catchall to ensure nfts are never loaded if hasNftRewards is false (there's no datasource).
  const tierData = hasNftRewards ? nftRewardTiersResponse ?? [] : []

  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tierData,
    projectId,
    dataSourceAddress,
  )

  const { data: collectionMetadataUri, loading: collectionUriLoading } =
    useNftCollectionMetadataUri(dataSourceAddress)

  const { data: flags, loading: flagsLoading } =
    useNftFlagsOf(dataSourceAddress)

  const CIDs = CIDsOfNftRewardTiersResponse(tierData)

  const loading = Boolean(
    nftRewardTiersLoading ||
      nftRewardsCIDsLoading ||
      collectionUriLoading ||
      flagsLoading,
  )

  return (
    <NftRewardsContext.Provider
      value={{
        nftRewards: {
          rewardTiers,
          // TODO: Load governance type
          governanceType: JB721GovernanceType.NONE,
          CIDs,
          contractVersion,
          collectionMetadata: {
            ...EMPTY_NFT_COLLECTION_METADATA, // only load the metadata CID in the context - other data not necessary
            uri: collectionMetadataUri,
          },
          postPayModal: projectMetadata?.nftPaymentSuccessModal,
          flags: flags ?? DEFAULT_NFT_FLAGS,
        },
        loading,
      }}
    >
      {children}
    </NftRewardsContext.Provider>
  )
}
