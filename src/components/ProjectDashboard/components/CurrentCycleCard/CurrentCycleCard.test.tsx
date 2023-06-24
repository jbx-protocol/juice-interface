/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import { useCurrentCycleCard } from 'components/ProjectDashboard/hooks'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { CurrentCycleCard } from './CurrentCycleCard'

jest.mock('components/ProjectDashboard/hooks')
jest.mock('components/ProjectDashboard/hooks/useProjectPageQueries')

describe('CurrentCycleCard', () => {
  const DefaultUseCurrentCycleCardMock = {
    currentCycleNumber: 1,
    timeRemainingText: '1 day',
  }
  beforeEach(() => {
    ;(useCurrentCycleCard as jest.Mock).mockReturnValue(
      DefaultUseCurrentCycleCardMock,
    )
    ;(useProjectPageQueries as jest.Mock).mockReturnValue({
      setProjectPageTab: jest.fn(),
    })
  })

  it('renders', () => {
    const { container } = render(<CurrentCycleCard />)
    expect(container).toMatchSnapshot()
  })
})
