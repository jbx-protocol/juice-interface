/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { BigNumber } from 'ethers'
import { FundingCyclesQuery } from 'generated/graphql'
import { usePastFundingCycles } from '../hooks/usePastFundingCycles'
import { HistorySubPanel } from './HistorySubPanel'

jest.mock('../hooks/usePastFundingCycles')
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
  const mockFundingCycles: FundingCyclesQuery['fundingCycles'] = [
    {
      ballot: '0x4b9f876c7fc5f6def8991fde639b2c812a85fb12',
      ballotRedemptionRate: 6000,
      basedOn: 1685615915,
      burnPaused: false,
      configuration: BigNumber.from('1686266495'),
      controllerMigrationAllowed: true,
      dataSource: '0x0000000000000000000000000000000000000000',
      discountRate: BigNumber.from('15000000'),
      distributionsPaused: false,
      duration: 604800,
      id: '2-397-37',
      metadata: BigNumber.from('453635417129768049443073'),
      metametadata: 0,
      mintingAllowed: false,
      mustStartAtOrAfter: null,
      number: 37,
      pausePay: false,
      preferClaimedTokenOverride: false,
      projectId: 397,
      redeemPaused: false,
      redemptionRate: 6000,
      reservedRate: 5000,
      setControllerAllowed: false,
      setTerminalsAllowed: true,
      shouldHoldFees: false,
      startTimestamp: 1694997023,
      terminalMigrationAllowed: true,
      transfersPaused: false,
      useDataSourceForPay: false,
      useDataSourceForRedeem: false,
      useTotalOverflowForRedemptions: false,
      weight: BigNumber.from('341957057837004498728584'),
      withdrawnAmount: BigNumber.from('30779487181046138000000'),
    },
  ]

  beforeEach(() => {
    ;(usePastFundingCycles as jest.Mock).mockReturnValue({
      loading: false,
      data: {
        fundingCycles: mockFundingCycles,
      },
      error: null,
    })
  })

  it('renders without crashing', () => {
    render(<HistorySubPanel />)
  })

  it('displays correct cycle data', () => {
    render(<HistorySubPanel />)
    expect(
      screen.getByText(`#${mockFundingCycles[0].number}`),
    ).toBeInTheDocument()
  })
})
