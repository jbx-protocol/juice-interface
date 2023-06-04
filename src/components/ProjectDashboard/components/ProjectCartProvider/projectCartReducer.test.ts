import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { ProjectCartState, projectCartReducer } from './projectCartReducer'

describe('projectCartReducer', () => {
  const DefaultState: ProjectCartState = {
    payAmount: undefined,
    expanded: false,
    userIsReceivingTokens: true,
  }

  test('addPayment will change payAmount to payload', () => {
    const state = { ...DefaultState, payAmount: undefined }
    const action = {
      type: 'addPayment' as const,
      payload: {
        amount: 100,
        currency: V2V3_CURRENCY_ETH,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      payAmount: {
        amount: 100,
        currency: V2V3_CURRENCY_ETH,
      },
    })
  })

  test('removePayment will set payAmount to undefined and userIsReceivingTokens to true', () => {
    const state = {
      ...DefaultState,
      userIsReceivingTokens: false,
      payAmount: {
        amount: 100,
        currency: V2V3_CURRENCY_ETH,
      },
    }
    const action = {
      type: 'removePayment' as const,
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      payAmount: undefined,
      userIsReceivingTokens: true,
    })
  })

  test('removeTokens will set userIsReceivingTokens to false', () => {
    const state = {
      ...DefaultState,
      userIsReceivingTokens: true,
    }
    const action = {
      type: 'removeTokens' as const,
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      userIsReceivingTokens: false,
    })
  })

  test('toggleExpanded will flip expanded', () => {
    const state = {
      ...DefaultState,
      expanded: false,
    }
    const action = {
      type: 'toggleExpanded' as const,
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      expanded: !state.expanded,
    })
  })
})
