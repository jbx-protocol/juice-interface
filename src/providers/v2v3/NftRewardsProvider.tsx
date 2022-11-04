import * as constants from '@ethersproject/constants'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useNftRewards from 'hooks/NftRewards'
import { useNftRewardTiersOf } from 'hooks/v2v3/contractReader/NftRewardTiersOf'
import { useContext } from 'react'
import { EMPTY_NFT_COLLECTION_METADATA } from 'redux/slices/editingV2Project'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'

export const NftRewardsProvider: React.FC = ({ children }) => {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const dataSource = fundingCycleMetadata?.dataSource

  /**
   * Load NFT Rewards data
   */
  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftRewardTiersOf(dataSource)
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    nftRewardTiersResponse ?? [],
  )

  const CIDs = CIDsOfNftRewardTiersResponse(nftRewardTiersResponse)

  // Assumes having `dataSource` means there are NFTs initially
  // In worst case, if has `dataSource` but isn't for NFTs:
  //    - loading will be true briefly
  //    - will resolve false when `useNftRewardTiersOf` fails
  const loading = Boolean(
    dataSource &&
      dataSource !== constants.AddressZero &&
      (nftRewardTiersLoading || nftRewardsCIDsLoading),
  )

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
