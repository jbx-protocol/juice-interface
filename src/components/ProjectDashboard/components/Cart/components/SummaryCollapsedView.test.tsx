/**
 * @jest-environment jsdom
 */

import { fireEvent, render } from '@testing-library/react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useCartSummary } from '../hooks/useCartSummary'
import { SummaryCollapsedView } from './SummaryCollapsedView'

jest.mock('../hooks/useCartSummary')

describe('SummaryCollapsedView', () => {
  const DefaultUseCartSummary = {
    amountText: '0.0000 ETH',
    currency: V2V3_CURRENCY_ETH,
    nftRewards: [],
    removePay: jest.fn(),
  }
  beforeEach(() => {
    ;(useCartSummary as jest.Mock).mockReturnValue(DefaultUseCartSummary)
    DefaultUseCartSummary.removePay.mockClear()
  })

  it('should render correctly', () => {
    const { container } = render(<SummaryCollapsedView />)
    expect(container).toMatchSnapshot()
  })

  it('should call removePay when trash icon is clicked', () => {
    const { getByTestId } = render(<SummaryCollapsedView />)
    const trashIcon = getByTestId('cart-summary-closed-view-trash-icon')
    fireEvent.click(trashIcon)
    expect(DefaultUseCartSummary.removePay).toHaveBeenCalled()
  })
})
