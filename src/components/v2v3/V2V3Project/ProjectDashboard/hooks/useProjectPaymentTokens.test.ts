/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import { useProjectCart } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectCart'
import { useTokensPerEth } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useTokensPerEth'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useProjectPaymentTokens } from './useProjectPaymentTokens'

jest.mock('components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectCart')
jest.mock('components/v2v3/V2V3Project/ProjectDashboard/hooks/useTokensPerEth')

describe('useProjectPaymentTokens', () => {
  const DefaultUseProjectCart = {
    totalAmount: {
      amount: 100,
      currency: V2V3_CURRENCY_ETH,
    },
    nftRewards: [],
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
