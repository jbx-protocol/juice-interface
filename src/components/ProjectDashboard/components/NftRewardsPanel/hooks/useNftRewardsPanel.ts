import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useCallback, useContext } from 'react'

export const useNftRewardsPanel = () => {
  const cart = useProjectCart()
  const {
    nftRewards: { rewardTiers },
    loading,
  } = useContext(NftRewardsContext)

  const handleTierSelect = useCallback(
    (tierId: number, quantity: number) => {
      cart.dispatch({
        type: 'upsertNftReward',
        payload: {
          nftReward: {
            id: tierId,
            quantity,
          },
        },
      })
    },
    [cart],
  )

  const handleTierDeselect = useCallback(
    (tierId: number) => {
      cart.dispatch({
        type: 'removeNftReward',
        payload: {
          id: tierId,
        },
      })
    },
    [cart],
  )

  return {
    rewardTiers,
    loading,
    handleTierSelect,
    handleTierDeselect,
  }
}
