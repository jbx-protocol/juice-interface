/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { useCurrentUpcomingConfigurationPanel } from '../hooks/useConfigurationPanel/useCurrentUpcomingConfigurationPanel'
import { CurrentUpcomingConfigurationPanel } from './CurrentUpcomingConfigurationPanel'

jest.mock('./ConfigurationPanel', () => {
  return {
    __esModule: true,
    ConfigurationPanel: jest
      .fn()
      .mockImplementation(({ cycle, token, otherRules }) => (
        <div data-testid="configuration-panel">
          {JSON.stringify(cycle)}
          {JSON.stringify(token)}
          {JSON.stringify(otherRules)}
        </div>
      )),
  }
})

jest.mock(
  '../hooks/useConfigurationPanel/useCurrentUpcomingConfigurationPanel',
  () => {
    return {
      __esModule: true,
      useCurrentUpcomingConfigurationPanel: jest.fn().mockReturnValue({
        cycle: { name: 'cycle' },
        token: { name: 'token' },
        otherRules: { name: 'otherRules' },
      }),
    }
  },
)

describe('CurrentUpcomingConfigurationPanel', () => {
  it('renders without crashing', () => {
    render(<CurrentUpcomingConfigurationPanel type="current" />)
  })

  it('displays correct configuration panel data', () => {
    render(<CurrentUpcomingConfigurationPanel type="current" />)
    expect(screen.getByTestId('configuration-panel')).toHaveTextContent(
      JSON.stringify({ name: 'cycle' }),
    )
    expect(screen.getByTestId('configuration-panel')).toHaveTextContent(
      JSON.stringify({ name: 'token' }),
    )
    expect(screen.getByTestId('configuration-panel')).toHaveTextContent(
      JSON.stringify({ name: 'otherRules' }),
    )
  })

  it('calls useCurrentUpcomingConfigurationPanel with correct type', () => {
    render(<CurrentUpcomingConfigurationPanel type="upcoming" />)
    expect(useCurrentUpcomingConfigurationPanel).toHaveBeenCalledWith(
      'upcoming',
    )
  })
})
