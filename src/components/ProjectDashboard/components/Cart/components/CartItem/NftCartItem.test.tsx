/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useNftCartItem } from '../../hooks/useNftCartItem'
import { NftCartItem } from './NftCartItem'

jest.mock('../../hooks/useNftCartItem')
jest.mock(
  'components/ProjectDashboard/components/NftRewardsCard/SmallNftSquare',
  () => ({
    SmallNftSquare: () => <div />,
  }),
)

describe('NftCartItem', () => {
  const DefaultUseNftCartItem = {
    price: {
      amount: 1,
      currency: V2V3_CURRENCY_ETH,
    },
    name: 'name',
    quantity: 1,
    fileUrl: 'fileUrl',
    removeNft: jest.fn(),
    increaseQuantity: jest.fn(),
    decreaseQuantity: jest.fn(),
  }
  beforeEach(() => {
    ;(useNftCartItem as jest.Mock).mockReturnValue(DefaultUseNftCartItem)
    DefaultUseNftCartItem.removeNft.mockClear()
    DefaultUseNftCartItem.increaseQuantity.mockClear()
    DefaultUseNftCartItem.decreaseQuantity.mockClear()
  })
  it('renders', () => {
    render(<NftCartItem id={1} quantity={1} />)
  })
})
