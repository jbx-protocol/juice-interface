import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { useCallback, useContext, useMemo } from 'react'
import { ProjectCartNftReward } from '../components/ReduxProjectCartProvider'
import { useProjectDispatch } from '../redux/hooks'
import { projectCartActions } from '../redux/projectCartSlice'

export const useNftCartItem = ({ id, quantity }: ProjectCartNftReward) => {
  const dispatch = useProjectDispatch()
  const { nftRewards } = useContext(NftRewardsContext)
  const rewardTiers = useMemo(
    () => nftRewards.rewardTiers ?? [],
    [nftRewards.rewardTiers],
  )
  const rewardTier = useMemo(
    () => rewardTiers.find(tier => tier.id === id),
    [rewardTiers, id],
  )
  const price = useMemo(
    () => ({
      amount: (rewardTier?.contributionFloor ?? 0) * quantity,
      currency: V2V3_CURRENCY_ETH,
    }),
    [quantity, rewardTier?.contributionFloor],
  )
  const removeNft = useCallback(
    () => dispatch(projectCartActions.removeNftReward({ id })),
    [dispatch, id],
  )
  const increaseQuantity = useCallback(
    () => dispatch(projectCartActions.increaseNftRewardQuantity({ id })),
    [dispatch, id],
  )
  const decreaseQuantity = useCallback(
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
