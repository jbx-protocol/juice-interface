import { useForm } from 'antd/lib/form/Form'
import { MarketplaceFormFields } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/shared/formFields'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { NftRewardTier } from 'models/nftRewards'
import { useContext, useEffect, useState } from 'react'
import { tiersEqual } from 'utils/nftRewards'

export function useEditingNfts() {
  const [rewardTiers, setRewardTiers] = useState<NftRewardTier[]>()
  const [marketplaceForm] = useForm<MarketplaceFormFields>()
  // a list of the `tierRanks` (IDs) of tiers that have been edited
  const [editedRewardTierIds, setEditedRewardTierIds] = useState<number[]>([])

  const { nftRewards, loading } = useContext(NftRewardsContext)

  const recordEditedTierId = (tierId: number | undefined) => {
    // only need to send tiers that have changed to adjustTiers
    // when id == undefined, tier is new
    if (!tierId || editedRewardTierIds.includes(tierId)) return
    setEditedRewardTierIds([...editedRewardTierIds, tierId])
  }

  const addRewardTier = (newRewardTier: NftRewardTier) => {
    const newRewardTiers = [...(rewardTiers ?? []), newRewardTier]
    setRewardTiers(newRewardTiers)
  }

  const editRewardTier = ({
    index,
    newRewardTier,
  }: {
    index: number
    newRewardTier: NftRewardTier
  }) => {
    if (
      rewardTiers &&
      !tiersEqual({ tier1: newRewardTier, tier2: rewardTiers[index] })
    ) {
      recordEditedTierId(rewardTiers[index].id)
    }

    const newRewardTiers = rewardTiers?.map((tier, idx) =>
      idx === index
        ? {
            ...tier,
            ...newRewardTier,
          }
        : tier,
    ) ?? [newRewardTier]
    setRewardTiers(newRewardTiers)
  }

  const deleteRewardTier = (tierIndex: number) => {
    if (!rewardTiers) return

    const newRewardTiers = rewardTiers.filter((_, idx) => tierIndex !== idx)

    setRewardTiers(newRewardTiers)
    recordEditedTierId(rewardTiers[tierIndex].id)
  }

  // Load the redux state into the state variable
  useEffect(() => {
    setRewardTiers(nftRewards.rewardTiers)
  }, [nftRewards.rewardTiers])

  return {
    rewardTiers,
    setRewardTiers,
    marketplaceForm,
    editedRewardTierIds,
    deleteRewardTier,
    editRewardTier,
    addRewardTier,
    loading,
  }
}
