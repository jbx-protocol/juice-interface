import { useProjectDispatch } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/redux/hooks'
import React from 'react'
import { projectCartActions } from '../components/ProjectDashboard/redux/projectCartSlice'
import { ProjectCartNftReward } from '../components/ProjectDashboard/ReduxProjectCartProvider'
import { useV4NftRewards } from '../contexts/V4NftRewards/V4NftRewardsProvider'
import { V4_CURRENCY_ETH } from '../utils/currency'

export const useNftCartItem = ({ id, quantity }: ProjectCartNftReward) => {
  const dispatch = useProjectDispatch()
  const { nftRewards } = useV4NftRewards()
  const rewardTiers = React.useMemo(
    () => nftRewards.rewardTiers ?? [],
    [nftRewards.rewardTiers],
  )

  const rewardTier = React.useMemo(
    () => rewardTiers.find(tier => tier.id === id),
    [rewardTiers, id],
  )

  const price = React.useMemo(
    () => ({
      amount: (rewardTier?.contributionFloor ?? 0) * quantity,
      currency: V4_CURRENCY_ETH,
    }),
    [quantity, rewardTier?.contributionFloor],
  )

  const removeNft = React.useCallback(
    () => dispatch(projectCartActions.removeNftReward({ id })),
    [dispatch, id],
  )

  const increaseQuantity = React.useCallback(
    () => dispatch(projectCartActions.increaseNftRewardQuantity({ id })),
    [dispatch, id],
  )

  const decreaseQuantity = React.useCallback(
    () => dispatch(projectCartActions.decreaseNftRewardQuantity({ id })),
    [dispatch, id],
  )

  return {
    name: rewardTier?.name,
    fileUrl: rewardTier?.fileUrl,
    quantity,
    price,
    removeNft,
    increaseQuantity,
    decreaseQuantity,
  }
}
