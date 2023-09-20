/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { useReservedTokensSubPanel } from '../hooks/useReservedTokensSubPanel'
import { ReservedTokensSubPanel } from './ReservedTokensSubPanel'

jest.mock('../hooks/useReservedTokensSubPanel')
jest.mock('../../ProjectAllocationRow/ProjectAllocationRow', () => ({
  ProjectAllocationRow: (props: unknown) => <div>{JSON.stringify(props)}</div>,
}))
jest.mock('./SendReservedTokensButton', () => ({
  SendReservedTokensButton: (props: unknown) => (
    <div>{JSON.stringify(props)}</div>
  ),
}))

describe('ReservedTokensSubPanel', () => {
  const DefaultUseReservedTokensSubPanel = {
    reservedList: [
      {
        address: '0x00000',
        percent: '0%',
      },
      {
        address: '0x00001',
        percent: '21%',
        projectId: 1,
      },
    ],
    reservedTokens: '21%',
    reservedRate: '82%',
  }
  beforeEach(() => {
    ;(useReservedTokensSubPanel as jest.Mock).mockImplementation(
      () => DefaultUseReservedTokensSubPanel,
    )
  })

  it('renders', () => {
    const { container } = render(<ReservedTokensSubPanel />)
    expect(container).toMatchSnapshot()
  })
})
