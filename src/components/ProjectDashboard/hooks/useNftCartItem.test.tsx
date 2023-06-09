/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useNftCartItem } from './useNftCartItem'

const DefaultNftRewardsContextMock = {
  nftRewards: {
    rewardTiers: [
      {
        id: 1,
        fileUrl: 'fileUrl',
        name: 'name',
        contributionFloor: 100,
      },
    ],
  },
  loading: false,
} as any

const renderUseNftCartItemHook = (quantity = 1) => {
  return renderHook(
    () =>
      useNftCartItem({
        id: 1,
        quantity,
      }),
    {
      wrapper: ({ children }) => (
        <NftRewardsContext.Provider value={DefaultNftRewardsContextMock}>
          {children}
        </NftRewardsContext.Provider>
      ),
    },
  )
}

jest.mock('components/ProjectDashboard/hooks')

describe('useNftCartItem', () => {
  const DefaultUseProjectCartMock = {
    nftRewards: [
      {
        quantity: 1,
        id: 1,
      },
    ],
    totalAmount: {
      amount: 100,
      currency: V2V3_CURRENCY_ETH,
    },
    dispatch: jest.fn(),
  }

  beforeEach(() => {
    ;(useProjectCart as jest.Mock).mockReturnValue(DefaultUseProjectCartMock)
  })

  it('should return reward tier name', () => {
    const { result } = renderUseNftCartItemHook()
    expect(result.current.name).toBe('name')
  })
  it('should return reward tier fileUrl', () => {
    const { result } = renderUseNftCartItemHook()
    expect(result.current.fileUrl).toBe('fileUrl')
  })
  it('should return quantity', () => {
    const { result } = renderUseNftCartItemHook()
    expect(result.current.quantity).toBe(1)
  })
  it('should return price', () => {
    const { result } = renderUseNftCartItemHook()
    expect(result.current.price).toEqual({
      amount: 100,
      currency: V2V3_CURRENCY_ETH,
    })
  })
  test('price should increase contributionFloor in multiples of quantity', () => {
    const { result } = renderUseNftCartItemHook(2)
    expect(result.current.price.amount).toBe(100 * 2)
  })

  test('removeNft should call dispatch with correct arguments', () => {
    const { result } = renderUseNftCartItemHook()
    result.current.removeNft()
    expect(DefaultUseProjectCartMock.dispatch).toHaveBeenCalledWith({
      type: 'removeNftReward',
      payload: {
        id: 1,
      },
    })
  })

  test('increaseQuantity should call dispatch with correct arguments', () => {
    const { result } = renderUseNftCartItemHook()
    result.current.increaseQuantity()
    expect(DefaultUseProjectCartMock.dispatch).toHaveBeenCalledWith({
      type: 'increaseNftRewardQuantity',
      payload: {
        id: 1,
      },
    })
  })

  test('decreaseQuantity should call dispatch with correct arguments', () => {
    const { result } = renderUseNftCartItemHook()
    result.current.decreaseQuantity()
    expect(DefaultUseProjectCartMock.dispatch).toHaveBeenCalledWith({
      type: 'decreaseNftRewardQuantity',
      payload: {
        id: 1,
      },
    })
  })
})
