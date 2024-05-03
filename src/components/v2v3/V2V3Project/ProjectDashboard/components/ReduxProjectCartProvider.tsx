import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useNftCredits } from 'hooks/JB721Delegate/useNftCredits'
import { useWallet } from 'hooks/Wallet'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import React, { useContext, useEffect } from 'react'
import { useProjectDispatch } from '../redux/hooks'
import { projectCartActions } from '../redux/projectCartSlice'

export type ProjectCartCurrencyAmount = {
  amount: number
  currency: V2V3CurrencyOption
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
  const { rewardTiers } = useContext(NftRewardsContext).nftRewards

  const { userAddress } = useWallet()
  const userNftCredits = useNftCredits(userAddress)

  const dispatch = useProjectDispatch()

  // Set the nfts on load
  useEffect(() => {
    dispatch(projectCartActions.setAllNftRewards(rewardTiers ?? []))
  }, [dispatch, rewardTiers])

  // Set the user's NFT credits on load
  useEffect(() => {
    dispatch(
      projectCartActions.setUserNftCredits(
        userNftCredits.data?.toBigInt() ?? 0n,
      ),
    )
  }, [dispatch, userNftCredits.data])

  return <>{children}</>
}
