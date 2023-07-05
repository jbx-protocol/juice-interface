/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import {
  useProjectCart,
  useTokensPerEth,
} from 'components/ProjectDashboard/hooks'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useProjectPaymentTokens } from './useProjectPaymentTokens'

jest.mock('components/ProjectDashboard/hooks')

describe('useProjectPaymentTokens', () => {
  const DefaultUseProjectCart = {
    totalAmount: {
      amount: 100,
      currency: V2V3_CURRENCY_ETH,
    },
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

  it('should return receivedTickets', () => {
    const { result } = renderHook(() => useProjectPaymentTokens())
    expect(result.current.receivedTickets).toEqual(100)
  })
})
