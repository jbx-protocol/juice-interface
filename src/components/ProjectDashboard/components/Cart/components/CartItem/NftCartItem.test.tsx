/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { NftCartItem } from './NftCartItem'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const voidFunction = () => {}

describe('NftCartItem', () => {
  it('renders', () => {
    render(
      <NftCartItem
        title="title"
        icon="icon"
        onDecrease={voidFunction}
        onIncrease={voidFunction}
        onRemove={voidFunction}
        price={{ amount: 1, currency: V2V3_CURRENCY_ETH }}
        quantity={1}
      />,
    )
  })
})
