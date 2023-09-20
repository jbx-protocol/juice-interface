/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { useProjectPaymentTokens } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectPaymentTokens'
import { ReceiveTokensItem } from './ReceiveTokensItem'

jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectPaymentTokens',
)

describe('ReceiveTokensItem', () => {
  const DefaultUseProjectPaymentTokens = {
    receivedTickets: '1',
    receivedTokenSymbolText: 'Symbol',
  }
  beforeEach(() => {
    ;(useProjectPaymentTokens as jest.Mock).mockReturnValue(
      DefaultUseProjectPaymentTokens,
    )
  })

  it('renders null if user is receiving tokens but has 0 received tickets', () => {
    ;(useProjectPaymentTokens as jest.Mock).mockReturnValue({
      ...DefaultUseProjectPaymentTokens,
      receivedTickets: '0',
    })
    render(<ReceiveTokensItem />)
    expect(screen.queryByText('Symbol Token')).not.toBeInTheDocument()
  })
  it('renders the correct text', () => {
    render(<ReceiveTokensItem />)
    expect(screen.getByText('Symbol Token')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
