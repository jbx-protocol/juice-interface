/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { PayProjectCard } from './PayProjectCard'

describe('PayProjectCard', () => {
  it('renders', () => {
    const { container } = render(<PayProjectCard />)
    expect(container).toMatchSnapshot()
  })

  test('entering text into input updates token value', () => {
    const { getByTestId } = render(<PayProjectCard />)
    const input = getByTestId('pay-input-input')
    const tokensPerPay = getByTestId('pay-project-card-tokens-per-pay')
    expect(input).toHaveValue('')
    screen.debug()
    expect(tokensPerPay).toHaveTextContent('Receive 0 tokens/1 ETH')
    fireEvent.change(input, { target: { value: '1' } })
    expect(input).toHaveValue('1')
    expect(tokensPerPay).toHaveTextContent('Receive 1 tokens/1 ETH')
  })
})
