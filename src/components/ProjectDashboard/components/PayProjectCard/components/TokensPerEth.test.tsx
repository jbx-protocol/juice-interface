/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { useTokensPerEth } from 'components/ProjectDashboard/hooks/useTokensPerEth'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { TokensPerEth } from './TokensPerEth'

jest.mock('components/ProjectDashboard/hooks/useTokensPerEth', () => ({
  useTokensPerEth: jest.fn(),
}))

describe('TokensPerEth', () => {
  const mockedTokensPerEth = {
    receivedTickets: '100',
    currencyText: 'ETH',
    receivedTokenSymbolText: 'TKN',
  }

  beforeEach(() => {
    ;(useTokensPerEth as jest.Mock).mockReturnValue(mockedTokensPerEth)
  })

  it('renders', () => {
    const { container } = render(
      <TokensPerEth
        currencyAmount={{
          amount: 1,
          currency: V2V3_CURRENCY_ETH,
        }}
      />,
    )
    expect(container).toMatchSnapshot()
    expect(screen.getByText('Receive 100 TKN/1 ETH')).toBeInTheDocument()
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
