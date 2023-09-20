/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useHistorySubPanel } from '../hooks/useHistorySubPanel'
import { HistoryData, HistorySubPanel } from './HistorySubPanel'

jest.mock('../hooks/useHistorySubPanel')
jest.mock('@headlessui/react', () => {
  return {
    __esModule: true,
    Disclosure: jest.requireActual('@headlessui/react').Disclosure,
    Transition: jest
      .fn()
      .mockImplementation(({ children, show }) => (
        <div>{show && children}</div>
      )),
  }
})
jest.mock('./HistoricalConfigurationPanel', () => {
  return {
    __esModule: true,
    HistoricalConfigurationPanel: jest
      .fn()
      .mockImplementation(({ fundingCycle, metadata }) => (
        <div data-testid={fundingCycle.id}>{JSON.stringify(metadata)}</div>
      )),
  }
})

describe('HistorySubPanel', () => {
  const mockData: HistoryData = [
    {
      _metadata: {
        fundingCycle: { id: '1' } as any,
        metadata: { data: 'test data' } as any,
      },
      cycleNumber: '1',
      withdrawn: '100',
      date: '2023-01-01',
    },
  ]

  beforeEach(() => {
    ;(useHistorySubPanel as jest.Mock).mockReturnValue({
      loading: false,
      data: mockData,
      error: null,
    })
  })

  it('renders without crashing', () => {
    render(<HistorySubPanel />)
  })

  it('displays correct cycle data', () => {
    render(<HistorySubPanel />)
    expect(screen.getByText(`#${mockData[0].cycleNumber}`)).toBeInTheDocument()
    expect(screen.getByText(mockData[0].withdrawn)).toBeInTheDocument()
    expect(screen.getByText(mockData[0].date)).toBeInTheDocument()
  })

  it('displays HistoricalConfigurationPanel with correct props on click', async () => {
    render(<HistorySubPanel />)
    const button = screen.getByTestId(
      `disclosure-button-${mockData[0].cycleNumber}`,
    )
    fireEvent.click(button)
    await waitFor(() =>
      expect(
        screen.getByTestId((mockData[0]._metadata.fundingCycle as any).id),
      ).toHaveTextContent(JSON.stringify(mockData[0]._metadata.metadata)),
    )
  })
})
