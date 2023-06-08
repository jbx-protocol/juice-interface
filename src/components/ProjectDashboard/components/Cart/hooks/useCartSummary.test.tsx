/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useCartSummary } from './useCartSummary'

jest.mock('components/ProjectDashboard/hooks')

const DefaultNftRewardsContextMock = {
  nftRewards: {
    rewardTiers: [
      {
        id: 1,
        fileUrl: 'fileUrl',
        name: 'name',
      },
    ],
  },
  loading: false,
} as any

const renderUseCartSummaryHook = () => {
  return renderHook(() => useCartSummary(), {
    wrapper: ({ children }) => (
      <NftRewardsContext.Provider value={DefaultNftRewardsContextMock}>
        {children}
      </NftRewardsContext.Provider>
    ),
  })
}

describe('useCartSummary', () => {
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

  it('should return amountText', () => {
    const { result } = renderUseCartSummaryHook()
    expect(result.current.amountText).toBe('Ξ100')
  })

  it('should return currency', () => {
    const { result } = renderUseCartSummaryHook()
    expect(result.current.currency).toBe(V2V3_CURRENCY_ETH)
  })

  it('should return nftRewards', () => {
    const { result } = renderUseCartSummaryHook()
    expect(result.current.nftRewards).toEqual([
      {
        quantity: 1,
        id: 1,
        fileUrl: 'fileUrl',
        name: 'name',
      },
    ])
  })

  test('removePay method should call dispatch', () => {
    const { result } = renderUseCartSummaryHook()
    result.current.removePay()
    expect(DefaultUseProjectCartMock.dispatch).toHaveBeenCalledWith({
      type: 'removePayment',
    })
  })
})
