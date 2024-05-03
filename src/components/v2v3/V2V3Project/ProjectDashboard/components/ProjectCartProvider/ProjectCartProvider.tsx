import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useNftCredits } from 'hooks/JB721Delegate/useNftCredits'
import { useWallet } from 'hooks/Wallet'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { ProjectCartAction, projectCartReducer } from './projectCartReducer'

export type ProjectCartCurrencyAmount = {
  amount: number
  currency: V2V3CurrencyOption
}

export type ProjectCartNftReward = {
  id: number
  quantity: number
}

type ProjectCartContextType = {
  dispatch: React.Dispatch<ProjectCartAction>
  payAmount: ProjectCartCurrencyAmount | undefined
  chosenNftRewards: ProjectCartNftReward[]
  nftRewardEligibilityDismissed: boolean
  payModalOpen: boolean
}

export const ProjectCartContext = createContext<ProjectCartContextType>({
  dispatch: () => {
    console.error('dispatch was called before it was initialized')
  },
  payAmount: undefined,
  chosenNftRewards: [],
  nftRewardEligibilityDismissed: false,
  payModalOpen: false,
})

export const ProjectCartProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { rewardTiers } = useContext(NftRewardsContext).nftRewards
  const [state, dispatch] = useReducer(projectCartReducer, {
    payAmount: undefined,
    chosenNftRewards: [],
    allNftRewards: [],
    userNftCredits: 0n,
    nftRewardEligibilityDismissed: false,
    payModalOpen: false,
  })

  const { userAddress } = useWallet()
  const userNftCredits = useNftCredits(userAddress)

  // Set the nfts on load
  useEffect(() => {
    dispatch({
      type: 'setAllNftRewards',
      payload: {
        nftRewards: rewardTiers ?? [],
      },
    })
  }, [rewardTiers])

  // Set the user's NFT credits on load
  useEffect(() => {
    dispatch({
      type: 'setUserNftCredits',
      payload: {
        userNftCredits: userNftCredits.data?.toBigInt() ?? 0n,
      },
    })
  }, [userNftCredits.data])

  const value = {
    dispatch,
    ...state,
  }

  return (
    <ProjectCartContext.Provider value={value}>
      {children}
    </ProjectCartContext.Provider>
  )
}
