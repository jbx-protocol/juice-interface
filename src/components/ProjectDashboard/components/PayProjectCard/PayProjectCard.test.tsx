/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, waitFor } from '@testing-library/react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { PayProjectCard } from './PayProjectCard'

jest.mock('./components/TokensPerEth', () => ({
  TokensPerEth: jest
    .fn()
    .mockImplementation(currencyAmount => (
      <div data-testid="tokens-per-eth">{JSON.stringify(currencyAmount)}</div>
    )),
}))

jest.mock('./components/PayInput')

describe('PayProjectCard', () => {
  it('renders', async () => {
    const { container } = render(<PayProjectCard />)
    await waitFor(() => expect(container).toMatchSnapshot())
  })

  test('entering text into input updates token value', async () => {
    const { getByTestId, getByRole } = render(<PayProjectCard />)
    const input = getByRole('textbox')
    const tokensPerEth = getByTestId('tokens-per-eth')
    await waitFor(() => {
      expect(input).toHaveValue('')
      expect(tokensPerEth).toHaveTextContent(
        JSON.stringify({
          currencyAmount: { amount: undefined, currency: V2V3_CURRENCY_ETH },
        }),
      )
    })
    await waitFor(() => {
      fireEvent.change(input, { target: { value: '1' } })
      expect(input).toHaveValue('1')
      expect(tokensPerEth).toHaveTextContent(
        JSON.stringify({
          currencyAmount: { amount: 1, currency: V2V3_CURRENCY_ETH },
        }),
      )
    })
  })
})
