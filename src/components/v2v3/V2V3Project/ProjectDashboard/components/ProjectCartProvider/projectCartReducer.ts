import { BigNumber } from 'ethers'
import { NftRewardTier } from 'models/nftRewards'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import {
  ProjectCartCurrencyAmount,
  ProjectCartNftReward,
} from './ProjectCartProvider'

export type ProjectCartAction =
  | {
      type: 'addPayment'
      payload: {
        amount: number
        currency: V2V3CurrencyOption
      }
    }
  | {
      type: 'removePayment'
    }
  | {
      type: 'payProject'
    }
  | {
      type: 'reset'
    }
  | {
      type: 'toggleExpanded'
    }
  | {
      type: 'upsertNftReward'
      payload: {
        nftReward: ProjectCartNftReward
      }
    }
  | {
      type: 'removeNftReward'
      payload: {
        id: number
      }
    }
  | {
      type: 'increaseNftRewardQuantity'
      payload: {
        id: number
      }
    }
  | {
      type: 'decreaseNftRewardQuantity'
      payload: {
        id: number
      }
    }
  | {
      type: 'dismissNftRewardEligibility'
    }
  | {
      type: 'setPayModal'
      payload: {
        open: boolean
      }
    }
  /**
   * Not to be called directly by components. This is used to set the NFT rewards by the provider.
   */
  | {
      /**
       * Not to be called directly by components. This is used to set the NFT rewards by the provider.
       */
      type: 'setAllNftRewards'
      payload: {
        nftRewards: NftRewardTier[]
      }
    }
  | {
      type: 'setUserNftCredits'
      payload: { userNftCredits: bigint }
    }
  | {
      type: 'openPayModal'
    }
  | {
      type: 'closePayModal'
    }

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
  userNftCredits: bigint
  nftRewardEligibilityDismissed: boolean
  payModalOpen: boolean
}

export const projectCartReducer = (
  state: ProjectCartState,
  action: ProjectCartAction,
): ProjectCartState => {
  switch (action.type) {
    case 'addPayment': {
      // Calculate NFT rewards
      const nftRewards = calculateEligibleNftRewards({
        rewardTiers: state.allNftRewards,
        weiPayAmount: parseWad(action.payload.amount.toString()),
        nftRewards: state.chosenNftRewards,
      })
      return {
        ...state,
        payAmount: {
          amount: action.payload.amount,
          currency: action.payload.currency,
        },
        chosenNftRewards: nftRewards.map(r => ({
          id: r.id,
          quantity: 1,
        })),
        nftRewardEligibilityDismissed: false,
      }
    }
    case 'removePayment':
      return {
        ...state,
        payAmount: undefined,
        nftRewardEligibilityDismissed: false,
      }
    case 'reset':
    case 'payProject':
      return {
        ...state,
        payAmount: undefined,
        chosenNftRewards: [],
        nftRewardEligibilityDismissed: false,
      }
    case 'toggleExpanded':
      return {
        ...state,
      }
    case 'upsertNftReward': {
      // TODO: NFT Credits
      const { nftReward } = action.payload
      const chosenNftCost = state.allNftRewards.find(
        n => n.id === nftReward.id,
      )?.contributionFloor
      const existingIndex = state.chosenNftRewards.findIndex(
        reward => reward.id === nftReward.id,
      )
      const payAmount = (state.payAmount?.amount ?? 0) + (chosenNftCost ?? 0)
      // If the NFT reward is not in the list, add it
      if (existingIndex === -1) {
        return {
          ...state,
          payAmount: {
            amount: payAmount,
            currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
          },
          chosenNftRewards: [...state.chosenNftRewards, nftReward],
        }
        // If the NFT reward is in the list, update it
      } else {
        const newNftRewards = [...state.chosenNftRewards]
        newNftRewards[existingIndex] = nftReward
        return {
          ...state,
          payAmount: {
            amount: payAmount,
            currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
          },
          chosenNftRewards: newNftRewards,
        }
      }
    }
    case 'removeNftReward': {
      const { id } = action.payload
      let payAmount = state.payAmount?.amount ?? 0
      const removedNftCost = state.allNftRewards.find(
        n => n.id === id,
      )?.contributionFloor
      const quantity = state.chosenNftRewards.find(
        nft => nft.id === id,
      )?.quantity
      if (quantity && quantity > 0) {
        payAmount = Math.max(0, payAmount - (removedNftCost ?? 0) * quantity)
      }
      return {
        ...state,
        payAmount: payAmount
          ? {
              amount: payAmount,
              currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
            }
          : undefined,
        chosenNftRewards: state.chosenNftRewards.filter(
          reward => reward.id !== id,
        ),
      }
    }
    case 'increaseNftRewardQuantity': {
      const { id } = action.payload
      const existingIndex = state.chosenNftRewards.findIndex(
        reward => reward.id === id,
      )
      if (existingIndex === -1) return state
      const newNftRewards = [...state.chosenNftRewards]
      newNftRewards[existingIndex] = {
        ...newNftRewards[existingIndex],
        quantity: newNftRewards[existingIndex].quantity + 1,
      }
      const chosenNftCost = state.allNftRewards.find(
        n => n.id === id,
      )?.contributionFloor
      const payAmount = (state.payAmount?.amount ?? 0) + (chosenNftCost ?? 0)
      return {
        ...state,
        payAmount: {
          amount: payAmount,
          currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
        },
        chosenNftRewards: newNftRewards,
      }
    }
    case 'decreaseNftRewardQuantity': {
      const { id } = action.payload
      const existingIndex = state.chosenNftRewards.findIndex(
        reward => reward.id === id,
      )
      if (existingIndex === -1) return state
      const removedNftCost = state.allNftRewards.find(
        n => n.id === id,
      )?.contributionFloor
      const payAmount = Math.max(
        0,
        (state.payAmount?.amount ?? 0) - (removedNftCost ?? 0),
      )
      const newNftRewards = [...state.chosenNftRewards]
      if (newNftRewards[existingIndex].quantity - 1 <= 0) {
        return {
          ...state,
          payAmount: payAmount
            ? {
                amount: payAmount,
                currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
              }
            : undefined,
          chosenNftRewards: newNftRewards.filter(
            reward => reward.id !== newNftRewards[existingIndex].id,
          ),
        }
      }

      newNftRewards[existingIndex] = {
        ...newNftRewards[existingIndex],
        quantity: newNftRewards[existingIndex].quantity - 1,
      }
      return {
        ...state,
        payAmount: payAmount
          ? {
              amount: payAmount,
              currency: state.payAmount?.currency ?? V2V3_CURRENCY_ETH,
            }
          : undefined,
        chosenNftRewards: newNftRewards,
      }
    }
    case 'dismissNftRewardEligibility':
      return {
        ...state,
        nftRewardEligibilityDismissed: true,
      }
    case 'setPayModal': {
      const { open } = action.payload
      return {
        ...state,
        payModalOpen: open,
      }
    }
    case 'setAllNftRewards': {
      const { nftRewards } = action.payload
      return {
        ...state,
        allNftRewards: nftRewards,
      }
    }
    case 'setUserNftCredits': {
      const { userNftCredits } = action.payload
      return {
        ...state,
        userNftCredits,
      }
    }
    case 'openPayModal':
      return {
        ...state,
        payModalOpen: true,
      }
    case 'closePayModal':
      return {
        ...state,
        payModalOpen: false,
      }
    default:
      return state
  }
}

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
