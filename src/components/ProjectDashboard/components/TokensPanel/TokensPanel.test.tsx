/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { useTokensPanel } from 'components/ProjectDashboard/hooks/useTokensPanel'
import { TokensPanel } from './TokensPanel'

jest.mock('components/ProjectDashboard/hooks/useTokensPanel')
jest.mock('../CyclesPayoutsPanel/components/ReservedTokensSubPanel', () => ({
  ReservedTokensSubPanel: jest
    .fn()
    .mockImplementation(() => <div>ReservedTokensSubPanel</div>),
}))
jest.mock('components/EthereumAddress', () =>
  jest.fn().mockImplementation(() => <div>EthereumAddress</div>),
)

describe('TokensPanel', () => {
  const DefaultUseTokensPanelResult = {
    userTokenBalance: 0,
    userTokenBalanceLoading: false,
    projectToken: 'projectToken',
    projectTokenAddress: 'projectTokenAddress',
    totalSupply: 0,
  }
  beforeEach(() => {
    ;(useTokensPanel as jest.Mock).mockReturnValue(DefaultUseTokensPanelResult)
  })
  it('renders', () => {
    render(<TokensPanel />)
  })
  it('doesnt render Your balance card if userTokenBalanceLoading is true', () => {
    ;(useTokensPanel as jest.Mock).mockReturnValue({
      ...DefaultUseTokensPanelResult,
      userTokenBalanceLoading: true,
    })
    const { queryByText } = render(<TokensPanel />)
    expect(queryByText('Your balance')).toBeNull()
  })
  it('doesnt render Your balance card if userTokenBalance is undefined', () => {
    ;(useTokensPanel as jest.Mock).mockReturnValue({
      ...DefaultUseTokensPanelResult,
      userTokenBalance: undefined,
    })
    const { queryByText } = render(<TokensPanel />)
    expect(queryByText('Your balance')).toBeNull()
  })

  it('renders Your balance card if userTokenBalance is defined and userTokenBalanceLoading is false', () => {
    ;(useTokensPanel as jest.Mock).mockReturnValue({
      ...DefaultUseTokensPanelResult,
      userTokenBalance: 100,
    })
    const { getByText } = render(<TokensPanel />)
    expect(getByText('Your balance')).toBeInTheDocument()
  })
})
