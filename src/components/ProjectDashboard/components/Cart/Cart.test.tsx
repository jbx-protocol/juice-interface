/**
 * @jest-environment jsdom
 */
import { fireEvent, render } from '@testing-library/react'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { Cart } from './Cart'

jest.mock('components/ProjectDashboard/hooks/useProjectCart')

describe('Cart', () => {
  const DefaultUseProjectCartMock = {
    dispatch: jest.fn(),
    expanded: false,
    visible: true,
  }
  beforeEach(() => {
    ;(useProjectCart as jest.Mock).mockReturnValue(DefaultUseProjectCartMock)
    DefaultUseProjectCartMock.dispatch.mockReset()
  })

  it('renders', () => {
    const { container } = render(<Cart />)
    expect(container).toMatchSnapshot()
  })

  test('clicking the cart dispatches a toggle expand', () => {
    const { getByTestId } = render(<Cart />)
    const cart = getByTestId('cart')
    expect(cart).toHaveClass('max-h-20')
    fireEvent.click(cart)
    expect(useProjectCart().dispatch).toHaveBeenCalledWith({
      type: 'toggleExpanded',
    })
  })

  test('clicking the unexpanded cart summary does not expand it', () => {
    const { getByTestId } = render(<Cart />)
    const cartSummary = getByTestId('cart-summary-closed-view-summary')
    expect(useProjectCart().dispatch).not.toHaveBeenCalled()
    fireEvent.click(cartSummary)
    expect(useProjectCart().dispatch).not.toHaveBeenCalled()
  })

  test('clicking the unexpanded cart total pay area does not expand it', () => {
    const { getByTestId } = render(<Cart />)
    const cartSummary = getByTestId('cart-summary-closed-view-total')
    expect(useProjectCart().dispatch).not.toHaveBeenCalled()
    fireEvent.click(cartSummary)
    expect(useProjectCart().dispatch).not.toHaveBeenCalled()
  })

  test('clicking the expanded cart summary does not collapse it', () => {
    ;(useProjectCart as jest.Mock).mockReturnValue({
      ...DefaultUseProjectCartMock,
      expanded: true,
    })
    const { getByTestId } = render(<Cart />)
    const cartSummary = getByTestId('cart-summary-open-view-summary')

    expect(useProjectCart().dispatch).not.toHaveBeenCalled()
    fireEvent.click(cartSummary)
    expect(useProjectCart().dispatch).not.toHaveBeenCalled()
  })

  test('clicking the expanded cart total pay area does not collapse it', () => {
    ;(useProjectCart as jest.Mock).mockReturnValue({
      ...DefaultUseProjectCartMock,
      expanded: true,
    })
    const { getByTestId } = render(<Cart />)
    const cartSummary = getByTestId('cart-summary-open-view-total')
    expect(useProjectCart().dispatch).not.toHaveBeenCalled()
    fireEvent.click(cartSummary)
    expect(useProjectCart().dispatch).not.toHaveBeenCalled()
  })
})
