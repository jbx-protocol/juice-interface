/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import {
  useProjectCart,
  useTokensPerEth,
} from 'components/ProjectDashboard/hooks'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { ProjectTokensCartItem } from './ProjectTokensCartItem'

jest.mock('components/ProjectDashboard/hooks')
jest.mock(
  'components/ProjectDashboard/components/ProjectHeader/components/ProjectHeaderLogo',
  () => ({
    ProjectHeaderLogo: () => <div>ProjectHeaderLogo</div>,
  }),
)

describe('ProjectTokensCartItem', () => {
  const DefaultUseProjectCartMock = {
    dispatch: jest.fn(),
    payAmount: {
      amount: 100,
      currency: V2V3_CURRENCY_ETH,
    },
    expanded: false,
    visible: true,
  }

  const UseTokensPerEthMock = {
    receivedTickets: '100',
  }
  beforeEach(() => {
    ;(useProjectCart as jest.Mock).mockReturnValue(DefaultUseProjectCartMock)
    ;(useTokensPerEth as jest.Mock).mockReturnValue(UseTokensPerEthMock)
  })

  it('renders', () => {
    const { container } = render(<ProjectTokensCartItem />)
    expect(container).toMatchSnapshot()
  })
})
