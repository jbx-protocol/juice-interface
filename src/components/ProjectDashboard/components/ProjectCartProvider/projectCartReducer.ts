import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { ProjectCartCurrencyAmount } from './ProjectCartProvider'

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
      type: 'removeTokens'
    }
  | {
      type: 'toggleExpanded'
    }

export type ProjectCartState = {
  payAmount: ProjectCartCurrencyAmount | undefined
  expanded: boolean
  userIsReceivingTokens: boolean
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
    default:
      return state
  }
}
