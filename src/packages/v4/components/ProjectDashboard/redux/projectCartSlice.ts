import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NftRewardTier } from 'models/nftRewards'
import { V4CurrencyOption } from 'packages/v4/models/v4CurrencyOption'
import { V4_CURRENCY_ETH } from 'packages/v4/utils/currency'
import { formatEther, parseEther } from 'viem'
import {
  ProjectCartCurrencyAmount,
  ProjectCartNftReward,
} from '../ReduxProjectCartProvider'

export type ProjectCartState = {
  payAmount: ProjectCartCurrencyAmount | undefined
  /**
   * The NFT rewards that the user has chosen or is eligible to mint.
   */
  chosenNftRewards: ProjectCartNftReward[]
  /**
   * All NFTs of the project.
   */
  allNftRewards: NftRewardTier[]
  userNftCredits: string
  nftRewardEligibilityDismissed: boolean
  expanded: boolean
  payModalOpen: boolean
}

const resetReducer: CaseReducer = state => {
  state.payAmount = undefined
  state.chosenNftRewards = []
  state.nftRewardEligibilityDismissed = false
  state.expanded = false
}

export const projectCartInitialState = {
  payAmount: undefined,
  chosenNftRewards: [],
  allNftRewards: [],
  userNftCredits: BigInt(0).toString(),
  nftRewardEligibilityDismissed: false,
  expanded: false,
  payModalOpen: false,
} as ProjectCartState

const projectCartSlice = createSlice({
  name: 'projectCart',
  initialState: projectCartInitialState,
  reducers: {
    addPayment: (
      state,
      action: PayloadAction<{ amount: number; currency: V4CurrencyOption }>,
    ) => {
      const nftRewards = calculateEligibleNftRewards({
        rewardTiers: state.allNftRewards,
        weiPayAmount: parseEther(action.payload.amount.toString()),
        nftRewards: state.chosenNftRewards,
      })
      state.payAmount = {
        amount: action.payload.amount,
        currency: action.payload.currency,
      }
      state.chosenNftRewards = nftRewards.map(r => ({
        id: r.id,
        quantity: 1,
      }))
      state.nftRewardEligibilityDismissed = false
    },
    removePayment: state => {
      state.payAmount = undefined
      state.chosenNftRewards = []
      state.nftRewardEligibilityDismissed = false
    },
    reset: resetReducer,
    payProject: resetReducer,
    upsertNftReward: (state, action: PayloadAction<ProjectCartNftReward>) => {
      const nftReward = action.payload
      const chosenNftCost = state.allNftRewards.find(
        n => n.id === nftReward.id,
      )?.contributionFloor
      const existingIndex = state.chosenNftRewards.findIndex(
        reward => reward.id === nftReward.id,
      )
      const payAmount =
        parseEther((state.payAmount?.amount ?? 0).toString()) +
        parseEther((chosenNftCost ?? 0).toString())

      if (existingIndex === -1) {
        state.payAmount = {
          amount: Number(formatEther(payAmount)),
          currency: state.payAmount?.currency ?? V4_CURRENCY_ETH,
        }
        state.chosenNftRewards = [...state.chosenNftRewards, nftReward]
      }
      const newNftRewards = [...state.chosenNftRewards]
      newNftRewards[existingIndex] = nftReward
      state.payAmount = {
        amount: Number(formatEther(payAmount)),
        currency: state.payAmount?.currency ?? V4_CURRENCY_ETH,
      }
      state.chosenNftRewards = newNftRewards
    },
    removeNftReward: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload
      let payAmount = state.payAmount?.amount ?? 0
      const removedNftCost = state.allNftRewards.find(
        n => n.id === id,
      )?.contributionFloor
      const quantity = state.chosenNftRewards.find(
        nft => nft.id === id,
      )?.quantity
      if (quantity && quantity > 0) {
        const nftCostBn =
          parseEther((removedNftCost ?? 0).toString()) * BigInt(quantity)
        const payAmountBn = parseEther(payAmount.toString())
        payAmount = Math.max(0, Number(formatEther(payAmountBn - nftCostBn)))
      }
      state.payAmount = payAmount
        ? {
            amount: payAmount,
            currency: state.payAmount?.currency ?? V4_CURRENCY_ETH,
          }
        : undefined
      state.chosenNftRewards = state.chosenNftRewards.filter(
        reward => reward.id !== id,
      )
    },
    increaseNftRewardQuantity: (
      state,
      action: PayloadAction<{ id: number }>,
    ) => {
      const { id } = action.payload
      const existingIndex = state.chosenNftRewards.findIndex(
        reward => reward.id === id,
      )
      if (existingIndex === -1) return
      const newNftRewards = [...state.chosenNftRewards]
      newNftRewards[existingIndex] = {
        ...newNftRewards[existingIndex],
        quantity: newNftRewards[existingIndex].quantity + 1,
      }
      const chosenNftCost = state.allNftRewards.find(
        n => n.id === id,
      )?.contributionFloor
      const payAmount =
        parseEther((state.payAmount?.amount ?? 0).toString()) +
        parseEther((chosenNftCost ?? 0).toString())

      state.payAmount = {
        amount: Number(formatEther(payAmount)),
        currency: state.payAmount?.currency ?? V4_CURRENCY_ETH,
      }
      state.chosenNftRewards = newNftRewards
    },
    decreaseNftRewardQuantity: (
      state,
      action: PayloadAction<{ id: number }>,
    ) => {
      const { id } = action.payload
      const existingIndex = state.chosenNftRewards.findIndex(
        reward => reward.id === id,
      )
      if (existingIndex === -1) return
      const removedNftCost = state.allNftRewards.find(
        n => n.id === id,
      )?.contributionFloor
      const payAmountBn =
        parseEther((state.payAmount?.amount ?? 0).toString()) -
        parseEther((removedNftCost ?? 0).toString())

      const payAmount = Math.max(0, Number(formatEther(payAmountBn)))
      const newNftRewards = [...state.chosenNftRewards]
      if (newNftRewards[existingIndex].quantity - 1 <= 0) {
        state.payAmount = payAmount
          ? {
              amount: payAmount,
              currency: state.payAmount?.currency ?? V4_CURRENCY_ETH,
            }
          : undefined
        state.chosenNftRewards = newNftRewards.filter(
          reward => reward.id !== newNftRewards[existingIndex].id,
        )
      } else {
        newNftRewards[existingIndex] = {
          ...newNftRewards[existingIndex],
          quantity: newNftRewards[existingIndex].quantity - 1,
        }
        state.payAmount = payAmount
          ? {
              amount: payAmount,
              currency: state.payAmount?.currency ?? V4_CURRENCY_ETH,
            }
          : undefined
        state.chosenNftRewards = newNftRewards
      }
    },
    setPayModal: (state, action: PayloadAction<{ open: boolean }>) => {
      const { open } = action.payload
      state.payModalOpen = open
    },
    setAllNftRewards: (state, action: PayloadAction<NftRewardTier[]>) => {
      state.allNftRewards = action.payload
    },
    setUserNftCredits: (state, action: PayloadAction<bigint>) => {
      state.userNftCredits = action.payload.toString()
    },
    openPayModal: state => {
      state.payModalOpen = true
    },
    closePayModal: state => {
      state.payModalOpen = false
    },
  },
})

export const projectCartReducer = projectCartSlice.reducer
export const projectCartActions = projectCartSlice.actions

const calculateEligibleNftRewards = ({
  rewardTiers,
  weiPayAmount,
  nftRewards,
}: {
  rewardTiers: NftRewardTier[] | undefined
  weiPayAmount: bigint
  nftRewards: ProjectCartNftReward[]
}) => {
  if (!rewardTiers || weiPayAmount === 0n) return []
  const ethAmount = Number(formatEther(weiPayAmount))
  const potentialRewards = rewardTiers
    .filter(tier => (tier.remainingSupply ?? Infinity) > 0)
    .filter(tier => tier.contributionFloor <= ethAmount)
    .filter(tier => !nftRewards.find(nft => nft.id === tier.id))
    .sort((a, b) => b.contributionFloor - a.contributionFloor)

  const eligibleRewards = []
  let remainingAmount = ethAmount
  // opt to try and keep the existing nft rewards if possible
  for (const reward of nftRewards) {
    const tier = rewardTiers.find(tier => tier.id === reward.id)
    if (tier && tier.contributionFloor <= remainingAmount) {
      eligibleRewards.push(reward)
      remainingAmount -= tier.contributionFloor
    }
  }

  for (const reward of potentialRewards) {
    if (remainingAmount >= reward.contributionFloor) {
      eligibleRewards.push(reward)
      remainingAmount -= reward.contributionFloor
    }
  }
  return eligibleRewards
}

export default projectCartSlice.reducer
