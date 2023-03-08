import { useForm } from 'antd/lib/form/Form'
import { NftRewardTier } from 'models/nftRewards'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { tiersEqual } from 'utils/nftRewards'
import {
  MarketplaceFormFields,
  NftPostPayModalFormFields,
} from '../../shared/formFields'

export function useAddNfts({
  setFormUpdated,
}: {
  setFormUpdated?: Dispatch<SetStateAction<boolean>>
} = {}) {
  const [rewardTiers, setRewardTiers] = useState<NftRewardTier[]>()
  const [postPayModalForm] = useForm<NftPostPayModalFormFields>()
  const [marketplaceForm] = useForm<MarketplaceFormFields>()

  const { nftRewards } = useAppSelector(state => state.editingV2Project)

  const addRewardTier = (newRewardTier: NftRewardTier) => {
    const newRewardTiers = [...(rewardTiers ?? []), newRewardTier]
    setRewardTiers(newRewardTiers)
    setFormUpdated?.(true)
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
      setFormUpdated?.(true)
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
  }

  // Load the redux state into the state variable
  useEffect(() => {
    setRewardTiers(nftRewards.rewardTiers)
  }, [nftRewards.rewardTiers])

  return {
    rewardTiers,
    setRewardTiers,
    postPayModalForm,
    marketplaceForm,
    deleteRewardTier,
    editRewardTier,
    addRewardTier,
  }
}
