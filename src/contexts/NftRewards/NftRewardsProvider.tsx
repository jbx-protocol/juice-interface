import useNftRewards from 'contexts/NftRewards/NftRewards'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftCollectionMetadataUri } from 'hooks/JB721Delegate/contractReader/NftCollectionMetadataUri'
import { useNftFlagsOf } from 'hooks/JB721Delegate/contractReader/NftFlagsOf'
import { useNftTiers } from 'hooks/JB721Delegate/contractReader/NftTiers'
import { JB721GovernanceType } from 'models/nftRewards'
import { useContext } from 'react'
import {
  DEFAULT_NFT_FLAGS,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/editingV2Project'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'
import { JB721DelegateContractsContext } from './JB721DelegateContracts/JB721DelegateContractsContext'

export const NftRewardsProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)
  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )

  const dataSourceAddress = fundingCycleMetadata?.dataSource

  // don't fetch stuff if there's no datasource in the first place.
  const hasNftRewards = Boolean(JB721DelegateVersion)

  /**
   * Load NFT Rewards data
   */
  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftTiers({
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

  const contextData = {
    nftRewards: {
      rewardTiers,
      // TODO: Load governance type
      governanceType: JB721GovernanceType.NONE,
      CIDs,
      collectionMetadata: {
        ...EMPTY_NFT_COLLECTION_METADATA, // only load the metadata CID in the context - other data not necessary
        uri: collectionMetadataUri,
      },
      postPayModal: projectMetadata?.nftPaymentSuccessModal,
      flags: flags ?? DEFAULT_NFT_FLAGS,
    },
    loading,
  }

  return (
    <NftRewardsContext.Provider value={contextData}>
      {children}
    </NftRewardsContext.Provider>
  )
}
