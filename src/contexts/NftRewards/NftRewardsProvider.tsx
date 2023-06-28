import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import useNftRewards from 'contexts/NftRewards/useNftRewards'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftCollectionMetadataUri } from 'hooks/JB721Delegate/contractReader/useNftCollectionMetadataUri'
import { useNftFlagsOf } from 'hooks/JB721Delegate/contractReader/useNftFlagsOf'
import { useNftTiers } from 'hooks/JB721Delegate/contractReader/useNftTiers'
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

  // fetch NFT tier data from the contract
  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftTiers({
      dataSourceAddress,
      shouldFetch: hasNftRewards,
    })

  // catchall to ensure nfts are never loaded if hasNftRewards is false (there's no datasource).
  const tierData = hasNftRewards ? nftRewardTiersResponse ?? [] : []
  const CIDs = CIDsOfNftRewardTiersResponse(tierData)

  // fetch NFT metadata (its image, name etc.) from ipfs
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    tierData,
    projectId,
    dataSourceAddress,
  )
  const nftsLoading = Boolean(nftRewardTiersLoading || nftRewardsCIDsLoading)

  // fetch some other related stuff
  const { data: collectionMetadataUri } =
    useNftCollectionMetadataUri(dataSourceAddress)
  const { data: flags } = useNftFlagsOf(dataSourceAddress)

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
    loading: nftsLoading,
  }

  return (
    <NftRewardsContext.Provider value={contextData}>
      {children}
    </NftRewardsContext.Provider>
  )
}
