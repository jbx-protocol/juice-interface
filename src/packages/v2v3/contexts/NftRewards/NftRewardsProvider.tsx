import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { JB721GovernanceType } from 'models/nftRewards'
import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import useNftRewards from 'packages/v2v3/contexts/NftRewards/useNftRewards'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useNftCollectionMetadataUri } from 'packages/v2v3/hooks/JB721Delegate/contractReader/useNftCollectionMetadataUri'
import { useNftCollectionPricingContext } from 'packages/v2v3/hooks/JB721Delegate/contractReader/useNftCollectionPricingContext'
import { useNftFlagsOf } from 'packages/v2v3/hooks/JB721Delegate/contractReader/useNftFlagsOf'
import { useNftTiers } from 'packages/v2v3/hooks/JB721Delegate/contractReader/useNftTiers'
import { useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_NFT_FLAGS,
  DEFAULT_NFT_PRICING,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/v2v3/shared/v2ProjectDefaultState'
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

  const [firstLoad, setFirstLoad] = useState(true)

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
  const loadedCIDs = CIDsOfNftRewardTiersResponse(tierData)

  const { data: pricing } = useNftCollectionPricingContext()

  // fetch NFT metadata (its image, name etc.) from ipfs
  const { data: loadedRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(tierData, projectId, dataSourceAddress)

  const rewardTiers = useMemo(() => {
    return loadedRewardTiers
  }, [loadedRewardTiers])

  const CIDs = useMemo(() => {
    return loadedCIDs
  }, [loadedCIDs])

  useEffect(() => {
    // First load is always true until either nftRewardTiersLoading or nftRewardsCIDsLoading is true
    if (firstLoad && (nftRewardTiersLoading || nftRewardsCIDsLoading)) {
      setFirstLoad(false)
    }
  }, [firstLoad, nftRewardTiersLoading, nftRewardsCIDsLoading])

  const nftsLoading = useMemo(() => {
    return Boolean(firstLoad || nftRewardTiersLoading || nftRewardsCIDsLoading)
  }, [firstLoad, nftRewardTiersLoading, nftRewardsCIDsLoading])

  // fetch some other related stuff
  const { data: collectionMetadataUri } =
    useNftCollectionMetadataUri(dataSourceAddress)
  const { data: flags } = useNftFlagsOf(dataSourceAddress)

  const contextData = {
    nftRewards: {
      rewardTiers,
      pricing: pricing ?? DEFAULT_NFT_PRICING,
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
