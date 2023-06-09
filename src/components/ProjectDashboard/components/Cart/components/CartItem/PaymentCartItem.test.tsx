/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { PaymentCartItem } from './PaymentCartItem'

jest.mock('components/ProjectDashboard/hooks')

describe('PaymentCartItem', () => {
  const DefaultUseProjectCartMock = {
    dispatch: jest.fn(),
    payAmount: {
      amount: 100,
      currency: V2V3_CURRENCY_ETH,
    },
    expanded: false,
    visible: true,
  }
  beforeEach(() => {
    ;(useProjectCart as jest.Mock).mockReturnValue(DefaultUseProjectCartMock)
  })

  it('renders', () => {
    const { container } = render(<PaymentCartItem />)
    expect(container).toMatchSnapshot()
  })
})
