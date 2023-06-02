/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { renderHook } from '@testing-library/react-hooks'
import { flagPairToDatum } from '../../utils/flagPairToDatum'
import { useFormatConfigurationOtherRulesSection } from './useFormatConfigurationOtherRulesSection'

jest.mock('../../utils/flagPairToDatum')

describe('useFormatConfigurationOtherRulesSection', () => {
  const mockFundingCycleMetadata = {
    pausePay: false,
    holdFees: false,
    global: {
      allowSetTerminals: true,
      allowSetController: true,
    },
    allowTerminalMigration: true,
    allowControllerMigration: true,
  }

  const mockUpcomingFundingCycleMetadata = {
    pausePay: true,
    holdFees: true,
    global: {
      allowSetTerminals: false,
      allowSetController: false,
    },
    allowTerminalMigration: false,
    allowControllerMigration: false,
  }

  beforeEach(() => {
    ;(flagPairToDatum as jest.Mock).mockClear()
    ;(flagPairToDatum as jest.Mock).mockImplementation(
      (name, current, upcoming) => ({ name, current, upcoming }),
    )
  })

  it('calculates the correct values', () => {
    const { result } = renderHook(() =>
      useFormatConfigurationOtherRulesSection({
        fundingCycleMetadata: mockFundingCycleMetadata as any,
        upcomingFundingCycleMetadata: mockUpcomingFundingCycleMetadata as any,
      }),
    )

    expect(flagPairToDatum).toHaveBeenCalledTimes(6)

    expect(result.current.paymentsToThisProject).toEqual({
      name: 'Payments to this project',
      current: true,
      upcoming: false,
    })

    expect(result.current.holdFees).toEqual({
      name: 'Hold fees',
      current: false,
      upcoming: true,
    })

    expect(result.current.setPaymentTerminals).toEqual({
      name: 'Set payment terminals',
      current: true,
      upcoming: false,
    })

    expect(result.current.setController).toEqual({
      name: 'Set controller',
      current: true,
      upcoming: false,
    })

    expect(result.current.migratePaymentTerminal).toEqual({
      name: 'Migrate payment terminal',
      current: true,
      upcoming: false,
    })

    expect(result.current.migrateController).toEqual({
      name: 'Migrate controller',
      current: true,
      upcoming: false,
    })
  })
})
