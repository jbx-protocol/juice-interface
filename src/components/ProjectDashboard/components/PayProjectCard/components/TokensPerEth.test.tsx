/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { useTokensPerEth } from '../hooks/useTokensPerEth'
import { TokensPerEth } from './TokensPerEth'

jest.mock('../hooks/useTokensPerEth', () => ({
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
          amount: '1',
          currency: 'eth',
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
          amount: '1',
          currency: 'eth',
        }}
      />,
    )
    expect(useTokensPerEth).toHaveBeenCalledWith({
      amount: '1',
      currency: 'eth',
    })
  })
})
