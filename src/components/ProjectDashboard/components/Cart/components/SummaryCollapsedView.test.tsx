/**
 * @jest-environment jsdom
 */

import { fireEvent, render, waitFor } from '@testing-library/react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useCartSummary } from '../hooks/useCartSummary'
import { SummaryCollapsedView } from './SummaryCollapsedView'

jest.mock('../hooks/useCartSummary')

describe('SummaryCollapsedView', () => {
  const DefaultUseCartSummary = {
    amountText: '0.0000 ETH',
    currency: V2V3_CURRENCY_ETH,
    nftRewards: [],
    resetCart: jest.fn(),
    payProject: jest.fn(),
  }
  beforeEach(() => {
    ;(useCartSummary as jest.Mock).mockReturnValue(DefaultUseCartSummary)
    DefaultUseCartSummary.resetCart.mockClear()
    DefaultUseCartSummary.payProject.mockClear()
  })

  it('should render correctly', () => {
    const { container } = render(<SummaryCollapsedView />)
    expect(container).toMatchSnapshot()
  })

  it('should call removePay when trash icon is clicked', () => {
    const { getByTestId, getByRole } = render(<SummaryCollapsedView />)
    const trashIcon = getByTestId('cart-summary-closed-view-trash-icon')
    fireEvent.click(trashIcon)
    waitFor(() => {
      const modalButton = getByRole('button')
      fireEvent.click(modalButton)
      expect(DefaultUseCartSummary.resetCart).toHaveBeenCalled()
    })
  })
})
