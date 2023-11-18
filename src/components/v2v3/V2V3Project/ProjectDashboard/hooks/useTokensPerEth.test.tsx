/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { renderHook } from '@testing-library/react-hooks'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { V2V3CurrencyProvider } from 'contexts/v2v3/V2V3CurrencyProvider'
import { BigNumber } from 'ethers'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import useWeiConverter from 'hooks/useWeiConverter'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { useTokensPerEth } from './useTokensPerEth'

jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext',
)

jest.mock('hooks/useCurrencyConverter')

jest.mock('hooks/useWeiConverter')

jest.mock('utils/tokenSymbolText', () => ({
  tokenSymbolText: jest.fn(),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <V2V3CurrencyProvider>{children}</V2V3CurrencyProvider>
}

describe('useTokensPerEth', () => {
  const mockUseProjectContext = {
    fundingCycle: { weight: BigNumber.from('347164525722847206831050') },
    fundingCycleMetadata: { reservedRate: BigNumber.from('5000') },
    tokenSymbol: 'mockTokenSymbol',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useProjectContext as jest.Mock).mockReturnValue(mockUseProjectContext)
    ;(useWeiConverter as jest.Mock).mockReturnValue(
      BigNumber.from('1000000000000000000'),
    )
    ;(tokenSymbolText as jest.Mock).mockReturnValue('mockTokenSymbol')
    ;(useCurrencyConverter as jest.Mock).mockReturnValue({
      usdToWei: jest.fn().mockReturnValue(BigNumber.from('1000000')),
    })
  })

  it('returns expected data for valid eth amount', () => {
    const { result } = renderHook(
      () => useTokensPerEth({ amount: 1, currency: V2V3_CURRENCY_ETH }),
      { wrapper },
    )

    expect(result.current).toHaveProperty('receivedTickets')
    expect(result.current).toHaveProperty('receivedTokenSymbolText')
    expect(result.current).toHaveProperty('currencyText')
  })

  it('returns expected data for valid usd amount', () => {
    const { result } = renderHook(
      () => useTokensPerEth({ amount: 1, currency: V2V3_CURRENCY_USD }),
      { wrapper },
    )

    expect(result.current).toEqual({
      receivedTickets: '173,582',
      receivedTokenSymbolText: 'mockTokenSymbol',
      currencyText: 'USD',
    })
  })

  it('returns default when wei is 0', () => {
    ;(useWeiConverter as jest.Mock).mockReturnValue(BigNumber.from('0'))
    const { result } = renderHook(
      () => useTokensPerEth({ amount: 0, currency: V2V3_CURRENCY_USD }),
      { wrapper },
    )

    expect(result.current).toEqual({
      receivedTickets: '0',
      receivedTokenSymbolText: 'mockTokenSymbol',
      currencyText: 'USD',
    })
  })
})
