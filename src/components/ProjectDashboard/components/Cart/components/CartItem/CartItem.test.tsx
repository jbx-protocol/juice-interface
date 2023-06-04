/**
 * @jest-environment jsdom
 */
import { fireEvent, render } from '@testing-library/react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { CartItem } from './CartItem'

describe('CartItem', () => {
  const onRemove = jest.fn()
  const CartItemProps = {
    title: 'title',
    price: { amount: 1, currency: V2V3_CURRENCY_ETH },
    icon: 'icon',
    onRemove,
  }

  beforeEach(() => {
    onRemove.mockReset()
  })

  it('renders', () => {
    const { container } = render(<CartItem {...CartItemProps} />)
    expect(container).toMatchSnapshot()
  })
  it('renders with quantity', () => {
    const { container } = render(<CartItem {...CartItemProps} quantity={2} />)
    expect(container).toMatchSnapshot()
  })

  it('renders price as dash when price is null', () => {
    const { container } = render(
      <CartItem {...CartItemProps} price={null} quantity={2} />,
    )
    expect(container).toMatchSnapshot()
  })

  it('calls onRemove when remove button is clicked', () => {
    const { getByTestId } = render(<CartItem {...CartItemProps} />)
    const removeButton = getByTestId('cart-item-remove-button')
    expect(onRemove).not.toHaveBeenCalled()
    fireEvent.click(removeButton)
    expect(onRemove).toHaveBeenCalled()
  })

  it('calls onDecrease when quantity button is clicked', () => {
    const onDecrease = jest.fn()
    const { getByTestId } = render(
      <CartItem {...CartItemProps} quantity={1} onDecrease={onDecrease} />,
    )
    const decreaseButton = getByTestId('cart-item-decrease-button')
    expect(onDecrease).not.toHaveBeenCalled()
    fireEvent.click(decreaseButton)
    expect(onDecrease).toHaveBeenCalled()
  })

  it('calls onIncrease when quantity button is clicked', () => {
    const onIncrease = jest.fn()
    const { getByTestId } = render(
      <CartItem {...CartItemProps} quantity={1} onIncrease={onIncrease} />,
    )
    const increaseButton = getByTestId('cart-item-increase-button')
    expect(onIncrease).not.toHaveBeenCalled()
    fireEvent.click(increaseButton)
    expect(onIncrease).toHaveBeenCalled()
  })
})
