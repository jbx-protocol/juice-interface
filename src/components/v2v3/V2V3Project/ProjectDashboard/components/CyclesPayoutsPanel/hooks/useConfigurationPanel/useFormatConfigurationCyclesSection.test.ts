/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks'
import { BigNumber } from 'ethers'
import { parseWad } from 'utils/format/formatNumber'
import { useFormatConfigurationCyclesSection } from './useFormatConfigurationCyclesSection'

// Use EST timezone for start time tests
beforeAll(() => {
  process.env.TZ = 'UTC'
})
afterAll(() => {
  delete process.env.TZ
})

describe('useFormatConfigurationCyclesSection', () => {
  const mockFundingCycle = {
    start: BigNumber.from(0),
    duration: BigNumber.from(10000),
    ballot: '0x0000000000000000000000000000000000000000',
  }

  const mockUpcomingFundingCycle = {
    duration: BigNumber.from(20000),
    ballot: '0x0000000000000000000000000000000000000001',
  }

  const mockDistributionLimitAmountCurrency = {
    distributionLimit: parseWad(100),
    currency: BigNumber.from(1),
  }

  const mockUpcomingDistributionLimitAmountCurrency = {
    distributionLimit: parseWad(200),
    currency: BigNumber.from(2),
  }

  it('calculates the correct values', () => {
    const { result } = renderHook(() =>
      useFormatConfigurationCyclesSection({
        fundingCycle: mockFundingCycle as any,
        upcomingFundingCycle: mockUpcomingFundingCycle as any,
        distributionLimitAmountCurrency: mockDistributionLimitAmountCurrency,
        upcomingDistributionLimitAmountCurrency:
          mockUpcomingDistributionLimitAmountCurrency,
      }),
    )

    const expectedDuration = {
      name: 'Duration',
      old: '2 hours',
      new: '5 hours',
    }
    const expectedStartTime = {
      name: 'Start time',
      new: '1970-01-01, Thursday, 02:46:40 AM UTC',
      // new: '1970-01-01, Wednesday, 09:46:40 PM EST',
      easyCopy: true,
    }
    const expectedPayouts = { name: 'Payouts', old: 'Ξ100', new: 'US$200' }
    const expectedEditDeadline = {
      name: 'Edit deadline',
      old: 'No deadline',
      new: 'Custom strategy',
    }

    expect(result.current.duration).toEqual(expectedDuration)
    expect(result.current.startTime).toEqual(expectedStartTime)
    expect(result.current.payouts).toEqual(expectedPayouts)
    expect(result.current.editDeadline).toEqual(expectedEditDeadline)
  })
})
