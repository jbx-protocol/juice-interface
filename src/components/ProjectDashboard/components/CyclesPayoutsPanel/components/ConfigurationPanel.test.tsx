/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import {
  ConfigurationPanel,
  ConfigurationPanelTableData,
} from './ConfigurationPanel'

// Mock ConfigurationTable to test if it's receiving correct props
jest.mock('./ConfigurationTable', () => {
  return {
    __esModule: true,
    ConfigurationTable: jest.fn().mockImplementation(({ title, data }) => (
      <div title={title} data-testid={title}>
        {JSON.stringify(data)}
      </div>
    )),
  }
})

describe('ConfigurationPanel', () => {
  const mockData: ConfigurationPanelTableData = {
    key1: { name: 'test name', old: 'test old', new: 'test new' },
  }

  it('renders without crashing', () => {
    render(
      <ConfigurationPanel
        cycle={mockData}
        token={mockData}
        otherRules={mockData}
        extension={mockData}
      />,
    )
  })

  it('passes correct props to ConfigurationTable', () => {
    render(
      <ConfigurationPanel
        cycle={mockData}
        token={mockData}
        otherRules={mockData}
        extension={mockData}
      />,
    )

    const cycleElement = screen.getByTestId('Cycle')
    expect(cycleElement).toHaveTextContent(JSON.stringify(mockData))

    const tokenElement = screen.getByTestId('Token')
    expect(tokenElement).toHaveTextContent(JSON.stringify(mockData))

    const otherRulesElement = screen.getByTestId('Other rules')
    expect(otherRulesElement).toHaveTextContent(JSON.stringify(mockData))
  })
})
