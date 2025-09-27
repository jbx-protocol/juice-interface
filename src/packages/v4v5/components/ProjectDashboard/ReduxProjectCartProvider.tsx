import { useV4NftRewards } from 'packages/v4v5/contexts/V4NftRewards/V4NftRewardsProvider'
import { useV4UserNftCredits } from 'packages/v4v5/contexts/V4UserNftCreditsProvider'
import { V4CurrencyOption } from 'packages/v4v5/models/v4CurrencyOption'
import React from 'react'
import { useProjectDispatch } from './redux/hooks'
import { projectCartActions } from './redux/projectCartSlice'

export type ProjectCartCurrencyAmount = {
  amount: number
  currency: V4CurrencyOption
}

export type ProjectCartNftReward = {
  id: number
  quantity: number
}

// Wrapper around some loads made to the redux store
export const ReduxProjectCartProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const {
    nftRewards: { rewardTiers },
  } = useV4NftRewards()
  const nftCredits = useV4UserNftCredits()
  const dispatch = useProjectDispatch()

  // Set the nfts on load
  React.useEffect(() => {
    dispatch(projectCartActions.setAllNftRewards(rewardTiers ?? []))
  }, [dispatch, rewardTiers])

  // Set the user's NFT credits on load
  React.useEffect(() => {
    if (nftCredits.isLoading) return
    dispatch(projectCartActions.setUserNftCredits(nftCredits.data ?? 0n))
  }, [dispatch, nftCredits.isLoading, nftCredits.data])

  return <>{children}</>
}
