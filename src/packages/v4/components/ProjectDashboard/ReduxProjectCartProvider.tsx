import { useWallet } from 'hooks/Wallet'
import { useReadJb721TiersHookPayCreditsOf } from 'juice-sdk-react'
import { useV4NftRewards } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import { V4CurrencyOption } from 'packages/v4/models/v4CurrencyOption'
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

  const { userAddress } = useWallet()
  const { data: nftCredits } = useReadJb721TiersHookPayCreditsOf({
    address: userAddress,
  })

  const dispatch = useProjectDispatch()

  // Set the nfts on load
  React.useEffect(() => {
    dispatch(projectCartActions.setAllNftRewards(rewardTiers ?? []))
  }, [dispatch, rewardTiers])

  // Set the user's NFT credits on load
  React.useEffect(() => {
    dispatch(projectCartActions.setUserNftCredits(nftCredits ?? 0n))
  }, [dispatch, nftCredits])

  return <>{children}</>
}
