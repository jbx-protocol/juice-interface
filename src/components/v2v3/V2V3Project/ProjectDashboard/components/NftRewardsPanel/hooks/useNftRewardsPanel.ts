import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useCallback, useContext } from 'react'
import { useProjectDispatch } from '../../../redux/hooks'
import { payRedeemActions } from '../../../redux/payRedeemSlice'
import { projectCartActions } from '../../../redux/projectCartSlice'

export const useNftRewardsPanel = () => {
  const dispatch = useProjectDispatch()
  const {
    nftRewards: { rewardTiers },
    loading,
  } = useContext(NftRewardsContext)

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
