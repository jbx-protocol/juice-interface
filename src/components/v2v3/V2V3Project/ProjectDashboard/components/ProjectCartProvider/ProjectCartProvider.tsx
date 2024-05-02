import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useNftCredits } from 'hooks/JB721Delegate/useNftCredits'
import { useWallet } from 'hooks/Wallet'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
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
  totalAmount: ProjectCartCurrencyAmount | undefined
  chosenNftRewards: ProjectCartNftReward[]
  nftRewardEligibilityDismissed: boolean
  visible: boolean
  expanded: boolean
  payModalOpen: boolean
}

export const ProjectCartContext = createContext<ProjectCartContextType>({
  dispatch: () => {
    console.error('dispatch was called before it was initialized')
  },
  payAmount: undefined,
  totalAmount: undefined,
  chosenNftRewards: [],
  nftRewardEligibilityDismissed: false,
  visible: false,
  expanded: false,
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
    expanded: false,
    payModalOpen: false,
  })

  const { userAddress } = useWallet()
  const userNftCredits = useNftCredits(userAddress)

  const visible = useMemo(
    () =>
      (state?.payAmount?.amount ?? 0) > 0 ||
      state?.chosenNftRewards?.length > 0,
    [state?.chosenNftRewards?.length, state?.payAmount?.amount],
  )

  const totalAmount = useMemo(() => {
    const payAmount = state.payAmount?.amount ?? 0

    return {
      amount: payAmount, //+ nftRewardsTotal,
      currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
    }
  }, [state.payAmount?.amount, state.payAmount?.currency])

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
    visible,
    totalAmount,
    userNftCredits,
  }

  return (
    <ProjectCartContext.Provider value={value}>
      {children}
    </ProjectCartContext.Provider>
  )
}
