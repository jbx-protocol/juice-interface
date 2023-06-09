/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import { useCurrentCycleCard } from 'components/ProjectDashboard/hooks'
import { CurrentCycleCard } from './CurrentCycleCard'

jest.mock('components/ProjectDashboard/hooks')

describe('CurrentCycleCard', () => {
  const DefaultUseCurrentCycleCardMock = {
    currentCycleNumber: 1,
    timeRemainingText: '1 day',
  }
  beforeEach(() => {
    ;(useCurrentCycleCard as jest.Mock).mockReturnValue(
      DefaultUseCurrentCycleCardMock,
    )
  })

  it('renders', () => {
    const { container } = render(<CurrentCycleCard />)
    expect(container).toMatchSnapshot()
  })
})
