import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
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
      type: 'removeTokens'
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
      type: 'setPayModal'
      payload: {
        open: boolean
      }
    }
  | {
      type: 'openPayModal'
    }
  | {
      type: 'closePayModal'
    }

export type ProjectCartState = {
  payAmount: ProjectCartCurrencyAmount | undefined
  nftRewards: ProjectCartNftReward[]
  expanded: boolean
  userIsReceivingTokens: boolean
  payModalOpen: boolean
}

export const projectCartReducer = (
  state: ProjectCartState,
  action: ProjectCartAction,
): ProjectCartState => {
  switch (action.type) {
    case 'addPayment':
      return {
        ...state,
        payAmount: {
          amount: action.payload.amount,
          currency: action.payload.currency,
        },
      }
    case 'removePayment':
      return {
        ...state,
        payAmount: undefined,
        // reset userIsReceivingTokens to true when removing payment
        userIsReceivingTokens: true,
      }
    case 'payProject':
      return {
        ...state,
        userIsReceivingTokens: true,
        payAmount: undefined,
        nftRewards: [],
        expanded: false,
      }
    case 'removeTokens':
      return {
        ...state,
        userIsReceivingTokens: false,
      }
    case 'toggleExpanded':
      return {
        ...state,
        expanded: !state.expanded,
      }
    case 'upsertNftReward': {
      const { nftReward } = action.payload
      const existingIndex = state.nftRewards.findIndex(
        reward => reward.id === nftReward.id,
      )
      if (existingIndex === -1) {
        return {
          ...state,
          nftRewards: [...state.nftRewards, nftReward],
        }
      } else {
        const newNftRewards = [...state.nftRewards]
        newNftRewards[existingIndex] = nftReward
        return {
          ...state,
          nftRewards: newNftRewards,
        }
      }
    }
    case 'removeNftReward': {
      const { id } = action.payload
      return {
        ...state,
        nftRewards: state.nftRewards.filter(reward => reward.id !== id),
      }
    }
    case 'increaseNftRewardQuantity': {
      const { id } = action.payload
      const existingIndex = state.nftRewards.findIndex(
        reward => reward.id === id,
      )
      if (existingIndex === -1) return state
      const newNftRewards = [...state.nftRewards]
      newNftRewards[existingIndex] = {
        ...newNftRewards[existingIndex],
        quantity: newNftRewards[existingIndex].quantity + 1,
      }
      return {
        ...state,
        nftRewards: newNftRewards,
      }
    }
    case 'decreaseNftRewardQuantity': {
      const { id } = action.payload
      const existingIndex = state.nftRewards.findIndex(
        reward => reward.id === id,
      )
      if (existingIndex === -1) return state
      const newNftRewards = [...state.nftRewards]
      if (newNftRewards[existingIndex].quantity - 1 <= 0) {
        return {
          ...state,
          nftRewards: newNftRewards.filter(
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
        nftRewards: newNftRewards,
      }
    }
    case 'setPayModal': {
      const { open } = action.payload
      return {
        ...state,
        payModalOpen: open,
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
