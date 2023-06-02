/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks'
import { BigNumber } from 'ethers'
import { parseWad } from 'utils/format/formatNumber'
import { useFormatConfigurationCyclesSection } from './useFormatConfigurationCyclesSection'

describe('useFormatConfigurationCyclesSection', () => {
  const mockFundingCycle = {
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
    const expectedPayouts = { name: 'Payouts', old: 'Ξ100', new: 'US$200' }
    const expectedEditDeadline = {
      name: 'Edit deadline',
      old: 'No deadline',
      new: 'Custom strategy',
    }

    expect(result.current.duration).toEqual(expectedDuration)
    expect(result.current.payouts).toEqual(expectedPayouts)
    expect(result.current.editDeadline).toEqual(expectedEditDeadline)
  })
})
