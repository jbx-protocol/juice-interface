import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { ProjectCartState, projectCartReducer } from './projectCartReducer'

describe('projectCartReducer', () => {
  const DefaultState: ProjectCartState = {
    payAmount: undefined,
    payModalOpen: false,
    expanded: false,
    userIsReceivingTokens: true,
    nftRewards: [
      {
        id: 1,
        quantity: 1,
      },
    ],
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

  test('upsertNftReward will add a new reward if it does not exist', () => {
    const state = {
      ...DefaultState,
      nftRewards: [],
    }
    const action = {
      type: 'upsertNftReward' as const,
      payload: {
        nftReward: {
          id: 1,
          quantity: 1,
        },
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    })
  })

  test('upsertNftReward will update an existing reward if it exists', () => {
    const state = {
      ...DefaultState,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    }
    const action = {
      type: 'upsertNftReward' as const,
      payload: {
        nftReward: {
          id: 1,
          quantity: 2,
        },
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [
        {
          id: 1,
          quantity: 2,
        },
      ],
    })
  })

  test('removeNftReward will remove a reward if it exists', () => {
    const state = {
      ...DefaultState,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    }
    const action = {
      type: 'removeNftReward' as const,
      payload: {
        id: 1,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [],
    })
  })

  test('removeNftReward will do nothing if the reward does not exist', () => {
    const state = {
      ...DefaultState,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    }
    const action = {
      type: 'removeNftReward' as const,
      payload: {
        id: 2,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    })
  })

  test('increaseNftRewardQuantity will increase the quantity of a reward if it exists', () => {
    const state = {
      ...DefaultState,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    }
    const action = {
      type: 'increaseNftRewardQuantity' as const,
      payload: {
        id: 1,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [
        {
          id: 1,
          quantity: 2,
        },
      ],
    })
  })

  test('increaseNftRewardQuantity will do nothing if the reward does not exist', () => {
    const state = {
      ...DefaultState,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    }
    const action = {
      type: 'increaseNftRewardQuantity' as const,
      payload: {
        id: 2,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    })
  })

  test('decreaseNftRewardQuantity will decrease the quantity of a reward if it exists', () => {
    const state = {
      ...DefaultState,
      nftRewards: [
        {
          id: 1,
          quantity: 2,
        },
      ],
    }
    const action = {
      type: 'decreaseNftRewardQuantity' as const,
      payload: {
        id: 1,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    })
  })

  test('decreaseNftRewardQuantity will do nothing if the reward does not exist', () => {
    const state = {
      ...DefaultState,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    }
    const action = {
      type: 'decreaseNftRewardQuantity' as const,
      payload: {
        id: 2,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    })
  })

  test('decreaseNftRewardQuantity will remove the reward if the quantity is 1', () => {
    const state = {
      ...DefaultState,
      nftRewards: [
        {
          id: 1,
          quantity: 1,
        },
      ],
    }
    const action = {
      type: 'decreaseNftRewardQuantity' as const,
      payload: {
        id: 1,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      nftRewards: [],
    })
  })

  test('setPayModal will set the pay modal', () => {
    const state = {
      ...DefaultState,
      payModal: false,
    }
    const action = {
      type: 'setPayModal' as const,
      payload: {
        open: true,
      },
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      payModalOpen: true,
    })
  })

  test('openPayModal will open the pay modal', () => {
    const state = {
      ...DefaultState,
      payModal: false,
    }
    const action = {
      type: 'openPayModal' as const,
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      payModalOpen: true,
    })
  })

  test('closePayModal will close the pay modal', () => {
    const state = {
      ...DefaultState,
      payModal: true,
    }
    const action = {
      type: 'closePayModal' as const,
    }
    expect(projectCartReducer(state, action)).toEqual({
      ...state,
      payModalOpen: false,
    })
  })
})
