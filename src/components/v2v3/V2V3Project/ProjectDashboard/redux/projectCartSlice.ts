import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { BigNumber } from 'ethers'
import { NftRewardTier } from 'models/nftRewards'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import {
  ProjectCartCurrencyAmount,
  ProjectCartNftReward,
} from '../components/ReduxProjectCartProvider'

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
      action: PayloadAction<{ amount: number; currency: V2V3CurrencyOption }>,
    ) => {
      const nftRewards = calculateEligibleNftRewards({
        rewardTiers: state.allNftRewards,
        weiPayAmount: parseWad(action.payload.amount.toString()),
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
      const payAmount = parseWad(state.payAmount?.amount ?? 0).add(
        parseWad(chosenNftCost ?? 0),
      )
      if (existingIndex === -1) {
        state.payAmount = {
          amount: Number(fromWad(payAmount)),
          currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
        }
        state.chosenNftRewards = [...state.chosenNftRewards, nftReward]
      }
      const newNftRewards = [...state.chosenNftRewards]
      newNftRewards[existingIndex] = nftReward
      state.payAmount = {
        amount: Number(fromWad(payAmount)),
        currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
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
        const nftCostBn = parseWad(removedNftCost ?? 0).mul(quantity)
        const payAmountBn = parseWad(payAmount)
        payAmount = Math.max(0, Number(fromWad(payAmountBn.sub(nftCostBn))))
      }
      state.payAmount = payAmount
        ? {
            amount: payAmount,
            currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
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
      const payAmount = parseWad(state.payAmount?.amount ?? 0).add(
        parseWad(chosenNftCost ?? 0),
      )
      state.payAmount = {
        amount: Number(fromWad(payAmount)),
        currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
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
      const payAmountBn = parseWad(state.payAmount?.amount ?? 0).sub(
        parseWad(removedNftCost ?? 0),
      )
      const payAmount = Math.max(0, Number(fromWad(payAmountBn)))
      const newNftRewards = [...state.chosenNftRewards]
      if (newNftRewards[existingIndex].quantity - 1 <= 0) {
        state.payAmount = payAmount
          ? {
              amount: payAmount,
              currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
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
              currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
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
  weiPayAmount: BigNumber
  nftRewards: ProjectCartNftReward[]
}) => {
  if (!rewardTiers || weiPayAmount.eq(0)) return []
  const ethAmount = Number(fromWad(weiPayAmount))
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
