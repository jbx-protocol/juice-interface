/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen } from '@testing-library/react'
import { useHistoricalConfigurationPanel } from '../hooks/useConfigurationPanel/useHistoricalConfigurationPanel'
import { HistoricalConfigurationPanel } from './HistoricalConfigurationPanel'

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
  '../hooks/useConfigurationPanel/useHistoricalConfigurationPanel',
  () => {
    return {
      __esModule: true,
      useHistoricalConfigurationPanel: jest.fn().mockReturnValue({
        cycle: { name: 'cycle' },
        token: { name: 'token' },
        otherRules: { name: 'otherRules' },
      }),
    }
  },
)

describe('CurrentUpcomingConfigurationPanel', () => {
  it('renders without crashing', () => {
    render(
      <HistoricalConfigurationPanel
        fundingCycle={{ id: '1' } as any}
        metadata={{ id: '1' } as any}
      />,
    )
  })

  it('displays correct configuration panel data', () => {
    render(
      <HistoricalConfigurationPanel
        fundingCycle={{ id: '1' } as any}
        metadata={{ id: '1' } as any}
      />,
    )
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

  it('calls useHistoricalConfigurationPanel with correct props', () => {
    render(
      <HistoricalConfigurationPanel
        fundingCycle={{ id: '1' } as any}
        metadata={{ id: '1' } as any}
      />,
    )
    expect(useHistoricalConfigurationPanel).toHaveBeenCalledWith({
      fundingCycle: { id: '1' },
      metadata: { id: '1' },
    })
  })
})
