/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { useTokensPerEth } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useTokensPerEth'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { TokensPerEth } from './TokensPerEth'

jest.mock(
  'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useTokensPerEth',
  () => ({
    useTokensPerEth: jest.fn(),
  }),
)

describe('TokensPerEth', () => {
  const mockedTokensPerEth = {
    receivedTickets: '100',
    currencyText: 'ETH',
    receivedTokenSymbolText: 'TKN',
  }

  beforeEach(() => {
    ;(useTokensPerEth as jest.Mock).mockReturnValue(mockedTokensPerEth)
  })

  it('renders when `currencyAmount` is 1', () => {
    const { container } = render(
      <TokensPerEth
        currencyAmount={{
          amount: 1,
          currency: V2V3_CURRENCY_ETH,
        }}
      />,
    )
    expect(container).toMatchSnapshot()
    expect(screen.getByText('Receive 100 TKN')).toBeInTheDocument()
  })

  it('calls useTokensPerEth with correct arguments', () => {
    render(
      <TokensPerEth
        currencyAmount={{
          amount: 1,
          currency: V2V3_CURRENCY_ETH,
        }}
      />,
    )
    expect(useTokensPerEth).toHaveBeenCalledWith({
      amount: 1,
      currency: V2V3_CURRENCY_ETH,
    })
  })
})
