/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { usePayProjectModal } from 'components/ProjectDashboard/hooks/usePayProjectModal'
import { useProjectPaymentTokens } from 'components/ProjectDashboard/hooks/useProjectPaymentTokens'
import { ReceiveSection } from './ReceiveSection'

jest.mock('components/ProjectDashboard/hooks/usePayProjectModal')
jest.mock('components/ProjectDashboard/hooks/useProjectPaymentTokens')

jest.mock('./ReceiveNftItem', () => ({
  ReceiveNftItem: jest.fn().mockImplementation(() => <div>NFT</div>),
}))

describe('ReceiveSection', () => {
  const DefaultUsePayProjectModal = {
    userAddress: '0x0000',
    nftRewards: [
      {
        id: 1,
        quantity: 1,
      },
    ],
  }
  const DefaultUseProjectPaymentTokens = {
    receivedTickets: '1',
  }
  beforeEach(() => {
    ;(usePayProjectModal as jest.Mock).mockReturnValue(
      DefaultUsePayProjectModal,
    )
    ;(useProjectPaymentTokens as jest.Mock).mockReturnValue(
      DefaultUseProjectPaymentTokens,
    )
  })

  it('returns null if nftRewards.length === 0 && receivedTickets === "0"', () => {
    ;(usePayProjectModal as jest.Mock).mockReturnValue({
      ...DefaultUsePayProjectModal,
      nftRewards: [],
    })
    ;(useProjectPaymentTokens as jest.Mock).mockReturnValue({
      ...DefaultUseProjectPaymentTokens,
      receivedTickets: '0',
    })
    render(<ReceiveSection />)
    expect(screen.queryByText('Receive')).not.toBeInTheDocument()
    expect(
      screen.queryByText('NFTs, tokens and rewards will be sent to'),
    ).not.toBeInTheDocument()
  })

  it.each`
    nftRewards                  | receivedTickets | reason
    ${[]}                       | ${'1'}          | ${'nftRewards.length === 0 && receivedTickets !== "0"'}
    ${[{ id: 1, quantity: 1 }]} | ${'0'}          | ${'nftRewards.length !== 0 && receivedTickets === "0"'}
    ${[{ id: 1, quantity: 1 }]} | ${'1'}          | ${'nftRewards.length !== 0 && receivedTickets !== "0"'}
  `('renders if $reason', ({ nftRewards, receivedTickets }) => {
    ;(usePayProjectModal as jest.Mock).mockReturnValue({
      ...DefaultUsePayProjectModal,
      nftRewards,
    })
    ;(useProjectPaymentTokens as jest.Mock).mockReturnValue({
      ...DefaultUseProjectPaymentTokens,
      receivedTickets,
    })
    render(<ReceiveSection />)
    expect(screen.getByText('Receive')).toBeInTheDocument()

    if (nftRewards.length !== 0) {
      expect(screen.getByText('NFT')).toBeInTheDocument()
    }
  })
})
