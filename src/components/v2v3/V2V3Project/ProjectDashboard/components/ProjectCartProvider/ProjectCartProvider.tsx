import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useNftCredits } from 'hooks/JB721Delegate/useNftCredits'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
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
  nftRewards: ProjectCartNftReward[]
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
  nftRewards: [],
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
  const { userAddress } = useWallet()
  const userNftCredits = useNftCredits(userAddress)
  const userNftCreditsNumber = parseFloat(
    formatEther(userNftCredits.data ?? BigNumber.from(0)),
  )

  const [state, dispatch] = useReducer(projectCartReducer, {
    payAmount: undefined,
    nftRewards: [],
    nftRewardEligibilityDismissed: false,
    expanded: false,
    payModalOpen: false,
  })
  const converter = useCurrencyConverter()
  const nftRewards = useContext(NftRewardsContext).nftRewards
  const rewardTiers = useMemo(
    () => nftRewards.rewardTiers ?? [],
    [nftRewards.rewardTiers],
  )

  const visible = useMemo(
    () => (state?.payAmount?.amount ?? 0) > 0 || state?.nftRewards?.length > 0,
    [state?.nftRewards?.length, state?.payAmount?.amount],
  )

  const totalAmount = useMemo(() => {
    let nftRewardsTotal = state.nftRewards.reduce(
      (acc, nft) =>
        acc +
        Number(rewardTiers.find(n => n.id === nft.id)?.contributionFloor ?? 0) *
          nft.quantity,
      0,
    )
    if (nftRewardsTotal > 0) {
      nftRewardsTotal -= userNftCreditsNumber
    }
    if (state.payAmount?.currency === V2V3_CURRENCY_USD) {
      nftRewardsTotal =
        converter.weiToUsd(parseWad(nftRewardsTotal))?.toNumber() ?? 0
    }

    const payAmount = state.payAmount?.amount ?? 0

    return {
      amount: payAmount + nftRewardsTotal,
      currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
    }
  }, [
    userNftCreditsNumber,
    converter,
    rewardTiers,
    state.nftRewards,
    state.payAmount?.amount,
    state.payAmount?.currency,
  ])

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
