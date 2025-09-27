import { useProjectDispatch } from 'packages/v4/components/ProjectDashboard/redux/hooks'
import { payRedeemActions } from 'packages/v4/components/ProjectDashboard/redux/payRedeemSlice'
import { projectCartActions } from 'packages/v4/components/ProjectDashboard/redux/projectCartSlice'
import { V4NftRewardsContext } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import { useCallback, useContext } from 'react'

export const useNftRewardsPanel = () => {
  const dispatch = useProjectDispatch()
  const {
    nftRewards: { rewardTiers },
    loading,
  } = useContext(V4NftRewardsContext)

  const handleTierSelect = useCallback(
    (tierId: number, quantity: number) => {
      dispatch(payRedeemActions.changeToPay())
      dispatch(projectCartActions.upsertNftReward({ id: tierId, quantity }))
    },
    [dispatch],
  )

  const handleTierDeselect = useCallback(
    (tierId: number) => {
      dispatch(payRedeemActions.changeToPay())
      dispatch(projectCartActions.removeNftReward({ id: tierId }))
    },
    [dispatch],
  )

  return {
    rewardTiers,
    loading,
    handleTierSelect,
    handleTierDeselect,
  }
}
