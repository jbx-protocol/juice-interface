import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useCallback, useContext, useMemo } from 'react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { ProjectCartNftReward } from '../../ProjectCartProvider'

export const useNftCartItem = ({ id, quantity }: ProjectCartNftReward) => {
  const { dispatch } = useProjectCart()
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
    () =>
      dispatch({
        type: 'removeNftReward',
        payload: {
          id,
        },
      }),
    [dispatch, id],
  )
  const increaseQuantity = useCallback(
    () =>
      dispatch({
        type: 'increaseNftRewardQuantity',
        payload: {
          id,
        },
      }),
    [dispatch, id],
  )
  const decreaseQuantity = useCallback(
    () =>
      dispatch({
        type: 'decreaseNftRewardQuantity',
        payload: {
          id,
        },
      }),
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
