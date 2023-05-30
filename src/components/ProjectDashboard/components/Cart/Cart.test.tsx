/**
 * @jest-environment jsdom
 */
import { fireEvent, render } from '@testing-library/react'
import { Cart } from './Cart'

describe('Cart', () => {
  it('renders', () => {
    const { container } = render(<Cart />)
    expect(container).toMatchSnapshot()
  })

  test('clicking the unexpanded cart expands it', () => {
    const { getByTestId } = render(<Cart />)
    const cart = getByTestId('cart')
    expect(cart).toHaveClass('max-h-20')
    fireEvent.click(cart)
    expect(cart).toHaveClass('max-h-[435px]')
  })

  test('clicking the expanded cart collapses it', () => {
    const { getByTestId } = render(<Cart />)
    const cart = getByTestId('cart')
    fireEvent.click(cart)
    expect(cart).toHaveClass('max-h-[435px]')
    fireEvent.click(cart)
    expect(cart).toHaveClass('max-h-20')
  })

  test('clicking the unexpanded cart summary does not expand it', () => {
    const { getByTestId } = render(<Cart />)
    const cart = getByTestId('cart')
    const cartSummary = getByTestId('cart-summary-closed-view-summary')
    expect(cart).toHaveClass('max-h-20')
    fireEvent.click(cartSummary)
    expect(cart).toHaveClass('max-h-20')
  })

  test('clicking the unexpanded cart total pay area does not expand it', () => {
    const { getByTestId } = render(<Cart />)
    const cart = getByTestId('cart')
    const cartSummary = getByTestId('cart-summary-closed-view-total')
    expect(cart).toHaveClass('max-h-20')
    fireEvent.click(cartSummary)
    expect(cart).toHaveClass('max-h-20')
  })

  test('clicking the expanded cart summary does not collapse it', () => {
    const { getByTestId } = render(<Cart />)
    const cart = getByTestId('cart')
    fireEvent.click(cart)
    const cartSummary = getByTestId('cart-summary-open-view-summary')
    expect(cart).toHaveClass('max-h-[435px]')
    fireEvent.click(cartSummary)
    expect(cart).toHaveClass('max-h-[435px]')
  })

  test('clicking the expanded cart total pay area does not collapse it', () => {
    const { getByTestId } = render(<Cart />)
    const cart = getByTestId('cart')
    fireEvent.click(cart)
    const cartSummary = getByTestId('cart-summary-open-view-total')
    expect(cart).toHaveClass('max-h-[435px]')
    fireEvent.click(cartSummary)
    expect(cart).toHaveClass('max-h-[435px]')
  })
})
