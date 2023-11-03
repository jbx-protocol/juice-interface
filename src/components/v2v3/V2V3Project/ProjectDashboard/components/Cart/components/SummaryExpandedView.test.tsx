/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useCartSummary } from '../hooks/useCartSummary'
import { SummaryExpandedView } from './SummaryExpandedView'

jest.mock('../hooks/useCartSummary')

describe('SummaryExpandedView', () => {
  const DefaultUseCartSummary = {
    amountText: '0.0000 ETH',
    currency: V2V3_CURRENCY_ETH,
    nftRewards: [],
    removePay: jest.fn(),
    payProject: jest.fn(),
  }
  beforeEach(() => {
    ;(useCartSummary as jest.Mock).mockReturnValue(DefaultUseCartSummary)
    DefaultUseCartSummary.removePay.mockClear()
    DefaultUseCartSummary.payProject.mockClear()
  })

  it('should render correctly', () => {
    const { container } = render(<SummaryExpandedView />)
    expect(container).toMatchSnapshot()
  })
})
