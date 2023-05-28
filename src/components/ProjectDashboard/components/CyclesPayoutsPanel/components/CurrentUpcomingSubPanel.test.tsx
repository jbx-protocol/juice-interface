/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { useCurrentUpcomingSubPanel } from '../hooks/useCurrentUpcomingSubPanel'
import { CurrentUpcomingSubPanel } from './CurrentUpcomingSubPanel'

jest.mock('../hooks/useCurrentUpcomingSubPanel')

// jest.mock('../hooks/useCurrentUpcomingSubPanel', () => ({
//   useCurrentUpcomingSubPanel: () => ({
//     loading: false,
//     cycleNumber: 1,
//     status: 'Active',
//     remainingTime: '1 day',
//     cycleLength: '1 day',
//     type: 'current',
//   }),
// }))

const DefaultResponse = {
  loading: false,
  cycleNumber: 1,
  status: 'Active',
  remainingTime: '1 day',
  cycleLength: '1 day',
  type: 'current',
}

const mockUseCurrentUpcomingSubPanel = useCurrentUpcomingSubPanel as jest.Mock

describe('CurrentUpcomingSubPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCurrentUpcomingSubPanel.mockReturnValue(DefaultResponse)
  })

  it.each(['current', 'upcoming'] as const)('renders %p', id => {
    const { container } = render(<CurrentUpcomingSubPanel id={id} />)
    expect(container).toMatchSnapshot()
  })

  it.each(['current', 'upcoming'] as const)(
    'renders a skeleton when loading %p',
    id => {
      mockUseCurrentUpcomingSubPanel.mockReturnValueOnce({
        ...DefaultResponse,
        type: id,
        loading: true,
      })
      const { getByTestId } = render(<CurrentUpcomingSubPanel id={id} />)
      expect(getByTestId('cycle-skeleton')).toBeInTheDocument()
    },
  )

  it('renders remaining time when current', () => {
    const { getByText } = render(<CurrentUpcomingSubPanel id="current" />)
    expect(getByText('Remaining time')).toBeInTheDocument()
  })

  it('renders cycle length when upcoming', () => {
    mockUseCurrentUpcomingSubPanel.mockReturnValueOnce({
      ...DefaultResponse,
      type: 'upcoming',
      loading: false,
    })
    const { getByText } = render(<CurrentUpcomingSubPanel id="upcoming" />)
    expect(getByText('Cycle length')).toBeInTheDocument()
  })
})
