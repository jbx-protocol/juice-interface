/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { useCurrentUpcomingSubPanel } from '../hooks/useCurrentUpcomingSubPanel'
import { CurrentUpcomingSubPanel } from './CurrentUpcomingSubPanel'

jest.mock('./ConfigurationDisplayCard', () => ({
  ConfigurationDisplayCard: jest.fn(() => <div>Configuration</div>),
}))

jest.mock('../hooks/useCurrentUpcomingSubPanel', () => ({
  useCurrentUpcomingSubPanel: jest.fn(),
}))

jest.mock('./PayoutsSubPanel', () => ({
  PayoutsSubPanel: jest.fn(() => <div>Payouts</div>),
}))

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
    mockUseCurrentUpcomingSubPanel.mockImplementation(() => DefaultResponse)
  })

  it.each(['current', 'upcoming'] as const)('renders %p', id => {
    mockUseCurrentUpcomingSubPanel.mockImplementationOnce(() => ({
      ...DefaultResponse,
      type: id,
      loading: false,
    }))
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
      const { container } = render(<CurrentUpcomingSubPanel id={id} />)
      expect(container).toMatchSnapshot()
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
