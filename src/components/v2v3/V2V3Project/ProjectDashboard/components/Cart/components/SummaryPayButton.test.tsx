/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { useCartSummary } from '../hooks/useCartSummary'
import { SummaryPayButton } from './SummaryPayButton'

jest.mock('../hooks/useCartSummary')

describe('SummaryPayButton copy', () => {
  beforeEach(() => {
    ;(useCartSummary as jest.Mock).mockReturnValue({
      payProject: jest.fn(),
      walletConnected: true,
    })
  })

  it('should render', () => {
    const { container } = render(<SummaryPayButton />)
    expect(container).toMatchSnapshot()
  })

  it.each`
    walletConnected | buttonText
    ${true}         | ${'Pay project'}
    ${false}        | ${'Connect wallet'}
  `(
    'should render button with text $buttonText when walletConnected is $walletConnected',
    ({ walletConnected, buttonText }) => {
      ;(useCartSummary as jest.Mock).mockReturnValue({
        payProject: jest.fn(),
        walletConnected,
      })
      render(<SummaryPayButton />)
      expect(screen.getByRole('button')).toHaveTextContent(buttonText)
    },
  )
})
