/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { PayInput } from './PayInput'

describe('PayInput', () => {
  it('renders', () => {
    const { container } = render(<PayInput />)
    expect(container).toMatchSnapshot()
  })

  it('renders with placeholder', () => {
    const { container } = render(<PayInput placeholder="placeholder" />)
    expect(container).toMatchSnapshot()
  })

  it('renders with value', () => {
    const { container } = render(
      <PayInput value={{ amount: '1', currency: V2V3_CURRENCY_ETH }} />,
    )
    expect(container).toMatchSnapshot()
  })

  test('clicking currency button changes currency', () => {
    render(<PayInput />)
    const button = screen.getByTestId('pay-input-currency-button')
    const icon = screen.getByTestId('pay-input-currency-icon')
    expect(button).toHaveTextContent('ETH')
    expect(icon).toHaveClass('bg-bluebs-50 text-bluebs-500')
    fireEvent.click(button)
    expect(button).toHaveTextContent('USD')
    expect(icon).toHaveClass('bg-melon-50 text-melon-600')
    fireEvent.click(button)
    expect(button).toHaveTextContent('ETH')
    expect(icon).toHaveClass('bg-bluebs-50 text-bluebs-500')
  })
})
