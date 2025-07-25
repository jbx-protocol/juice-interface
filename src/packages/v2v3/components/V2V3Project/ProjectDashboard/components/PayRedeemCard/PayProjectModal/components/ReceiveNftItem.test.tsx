/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { useNftCartItem } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useNftCartItem'
import { ReceiveNftItem } from './ReceiveNftItem'

jest.mock(
  'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useNftCartItem',
)

jest.mock('components/NftRewards/SmallNftSquare', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SmallNftSquare: ({ nftReward: { fileUrl } }: any) => <img src={fileUrl} alt="" />,
}))

describe('ReceiveNftItem', () => {
  const DefaultUseNftCartItem = {
    fileUrl: 'https://example.com',
    name: 'Example NFT',
    quantity: 1,
  }
  const DefaultNftReward = {
    id: 1,
    quantity: 1,
  }
  beforeEach(() => {
    ;(useNftCartItem as jest.Mock).mockReturnValue(DefaultUseNftCartItem)
  })

  it('renders with correct fileUrl, name, and quantity', () => {
    render(<ReceiveNftItem nftReward={DefaultNftReward} />)
    expect(screen.getByText(DefaultUseNftCartItem.name)).toBeInTheDocument()
    expect(screen.getByText(DefaultUseNftCartItem.quantity)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      DefaultUseNftCartItem.fileUrl,
    )
  })
})
