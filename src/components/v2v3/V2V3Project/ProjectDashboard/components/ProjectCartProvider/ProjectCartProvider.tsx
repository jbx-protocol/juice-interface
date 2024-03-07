import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
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

/**
 * Return the sum total of selected NFTs to mint, minus any credits the user has.
 * @returns The total amount in ETH or USD (not wei!), depending on the selected currency.
 */
function useNftRewardsTotal({
  selectedNftRewards,
  payAmountCurrency,
  userNftCredits,
}: {
  selectedNftRewards: ProjectCartNftReward[]
  payAmountCurrency: V2V3CurrencyOption | undefined
  userNftCredits: ReturnType<typeof useNftCredits>
}) {
  const converter = useCurrencyConverter()
  const nftRewards = useContext(NftRewardsContext).nftRewards

  const rewardTiers = nftRewards.rewardTiers ?? []

  const nftRewardsTotalEth = selectedNftRewards.reduce(
    (acc, nft) =>
      acc +
      Number(rewardTiers.find(n => n.id === nft.id)?.contributionFloor ?? 0) *
        nft.quantity,
    0,
  )

  // Subtract the user's NFT credits from the total. Never go below 0.
  if (
    nftRewardsTotalEth > 0 &&
    userNftCredits.data &&
    userNftCredits.data.gt(0)
  ) {
    const nftRewardsTotalWei = parseWad(nftRewardsTotalEth)
    const newTotalWei = nftRewardsTotalWei.sub(userNftCredits.data)
    const newTotalEth = parseFloat(formatEther(newTotalWei))

    return Math.max(0, newTotalEth)
  }

  if (payAmountCurrency === V2V3_CURRENCY_USD) {
    return converter.weiToUsd(parseWad(nftRewardsTotalEth))?.toNumber() ?? 0
  }

  return nftRewardsTotalEth
}

export const ProjectCartProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [state, dispatch] = useReducer(projectCartReducer, {
    payAmount: undefined,
    nftRewards: [],
    nftRewardEligibilityDismissed: false,
    expanded: false,
    payModalOpen: false,
  })

  const { userAddress } = useWallet()
  const userNftCredits = useNftCredits(userAddress)

  const visible = useMemo(
    () => (state?.payAmount?.amount ?? 0) > 0 || state?.nftRewards?.length > 0,
    [state?.nftRewards?.length, state?.payAmount?.amount],
  )

  const nftRewardsTotal = useNftRewardsTotal({
    selectedNftRewards: state.nftRewards,
    payAmountCurrency: state.payAmount?.currency,
    userNftCredits,
  })

  const totalAmount = useMemo(() => {
    const payAmount = state.payAmount?.amount ?? 0

    return {
      amount: payAmount + nftRewardsTotal,
      currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
    }
  }, [state.payAmount?.amount, state.payAmount?.currency, nftRewardsTotal])

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
