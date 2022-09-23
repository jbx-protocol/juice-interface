import * as constants from '@ethersproject/constants'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useNftRewards from 'hooks/NftRewards'
import { useNftRewardTiersOf } from 'hooks/v2v3/contractReader/NftRewardTiersOf'
import { useContext } from 'react'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'

export const NftRewardsProvider: React.FC = ({ children }) => {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const dataSource = fundingCycleMetadata?.dataSource

  /**
   * Load NFT Rewards data
   */
  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftRewardTiersOf(dataSource)
  let CIDs: string[] = []
  if (nftRewardTiersResponse) {
    CIDs = CIDsOfNftRewardTiersResponse(nftRewardTiersResponse)
  }
  const { data: rewardTiers, isLoading: nftRewardTiersLoading } = useNftRewards(
    nftRewardTiersResponse ?? [],
  )
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
      value={{ nftRewards: { loading, rewardTiers, CIDs } }}
    >
      {children}
    </NftRewardsContext.Provider>
  )
}
