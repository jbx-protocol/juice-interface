import { useContext, useEffect, useState } from 'react'

import { useForm } from 'antd/lib/form/Form'
import { NftRewardTier } from 'models/nftRewards'
import { V4V5NftRewardsContext } from 'packages/v4v5/contexts/V4V5NftRewards/V4V5NftRewardsProvider'
import { tiersEqual } from 'utils/nftRewards'
import { MarketplaceFormFields } from '../UpdateNftsPage/formFields'

export function useEditingNfts() {
  const [rewardTiers, _setRewardTiers] = useState<NftRewardTier[]>()
  const [marketplaceForm] = useForm<MarketplaceFormFields>()
  // a list of the `tierRanks` (IDs) of tiers that have been edited
  const [editedRewardTierIds, setEditedRewardTierIds] = useState<number[]>([])

  const { nftRewards, loading } = useContext(V4V5NftRewardsContext)

  const deriveAndSetEditedIds = (newRewards: NftRewardTier[]) => {
    if (!nftRewards.rewardTiers) return
    const editedIds = nftRewards.rewardTiers
      .filter(
        oldReward =>
          // oldReward does not exist (exactly) in newRewards.
          !newRewards.some(newReward =>
            tiersEqual({ tier1: oldReward, tier2: newReward }),
          ),
      )
      .map(reward => reward.id)

    setEditedRewardTierIds(editedIds)
  }

  const setRewardTiers = (newRewards: NftRewardTier[]) => {
    deriveAndSetEditedIds(newRewards)
    _setRewardTiers(newRewards)
  }

  // Load the redux state into the state variable
  useEffect(() => {
    _setRewardTiers(nftRewards.rewardTiers)
  }, [nftRewards.rewardTiers])

  return {
    rewardTiers,
    setRewardTiers,
    marketplaceForm,
    editedRewardTierIds,
    loading,
  }
}
