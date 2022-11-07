import { readNetwork } from 'constants/networks'
import { V2V3_PROJECT_IDS_NETWORK } from 'constants/v2v3/projectIds'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useNftRewards from 'hooks/NftRewards'
import { useNftRewardTiersOf } from 'hooks/v2v3/contractReader/NftRewardTiersOf'
import { useContext } from 'react'
import { EMPTY_NFT_COLLECTION_METADATA } from 'redux/slices/editingV2Project'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'

/**ƒ
 * Get the limit of tiers to load for specific projects.
 *
 * By default we only load 3 tiers, but for some projects they have more (like Defifa has 32)
 *
 * @todo we shouldnt be doing this. We should page through the tiers until we get none back. Potentially via infinite scroll.
 * Tech debt to launch defifa quickly
 */
const limitOverride = (projectId: number | undefined) => {
  // Get all the Defifa tiers
  return projectId === V2V3_PROJECT_IDS_NETWORK[readNetwork.name]?.DEFIFA
    ? 32 // Defifa has 32 tiers
    : undefined
}

export const NftRewardsProvider: React.FC = ({ children }) => {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)

  /**
   * Load NFT Rewards data
   */
  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftRewardTiersOf({
      dataSourceAddress: fundingCycleMetadata?.dataSource,
      limit: limitOverride(projectId),
    })

  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    nftRewardTiersResponse ?? [],
  )

  const CIDs = CIDsOfNftRewardTiersResponse(nftRewardTiersResponse)

  // Assumes having `dataSource` means there are NFTs initially
  // In worst case, if has `dataSource` but isn't for NFTs:
  //    - loading will be true briefly
  //    - will resolve false when `useNftRewardTiersOf` fails
  const loading = nftRewardTiersLoading || nftRewardsCIDsLoading

  return (
    <NftRewardsContext.Provider
      value={{
        nftRewards: {
          rewardTiers,
          CIDs,
          collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
          postPayModal: projectMetadata?.nftPaymentSuccessModal,
        },
        loading,
      }}
    >
      {children}
    </NftRewardsContext.Provider>
  )
}
