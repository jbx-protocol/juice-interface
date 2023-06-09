/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import {
  useProjectCart,
  useTokensPerEth,
} from 'components/ProjectDashboard/hooks'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useProjectTokensCartItem } from './useProjectTokensCartItem'

jest.mock('components/ProjectDashboard/hooks')

describe('useProjectTokensCartItem', () => {
  const DefaultUseProjectCart = {
    totalAmount: {
      amount: 100,
      currency: V2V3_CURRENCY_ETH,
    },
    userIsReceivingTokens: true,
    dispatch: jest.fn(),
  }
  const DefaultUseTokensPerEth = {
    receivedTickets: 100,
  }
  beforeEach(() => {
    ;(useProjectCart as jest.Mock).mockReturnValue(DefaultUseProjectCart)
    ;(useTokensPerEth as jest.Mock).mockReturnValue(DefaultUseTokensPerEth)
    DefaultUseProjectCart.dispatch.mockClear()
  })

  it('should return userIsReceivingTokens', () => {
    const { result } = renderHook(() => useProjectTokensCartItem())
    expect(result.current.userIsReceivingTokens).toEqual(true)
  })

  it('should return receivedTickets', () => {
    const { result } = renderHook(() => useProjectTokensCartItem())
    expect(result.current.receivedTickets).toEqual(100)
  })

  test('removeTokens should call dispatch', () => {
    const { result } = renderHook(() => useProjectTokensCartItem())
    result.current.removeTokens()
    expect(DefaultUseProjectCart.dispatch).toHaveBeenCalled()
    expect(DefaultUseProjectCart.dispatch).toHaveBeenCalledWith({
      type: 'removeTokens',
    })
  })
})
