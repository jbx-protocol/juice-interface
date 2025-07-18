/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from '@ethersproject/bignumber'
import { renderHook } from '@testing-library/react'
import { flagPairToDatum } from 'components/Project/ProjectTabs/utils/flagPairToDatum'
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum'
import {
  computeIssuanceRate,
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
} from 'packages/v2v3/utils/math'
import { formattedNum } from 'utils/format/formatNumber'
import { useFormatConfigurationTokenSection } from './useFormatConfigurationTokenSection'

jest.mock('components/Project/ProjectTabs/utils/flagPairToDatum')
jest.mock('components/Project/ProjectTabs/utils/pairToDatum')
jest.mock('packages/v2v3/utils/math')
jest.mock('utils/format/formatNumber')

describe('useFormatConfigurationTokenSection', () => {
  const mockFundingCycle = {
    weight: BigNumber.from(1),
    discountRate: BigNumber.from(2),
  }
  const mockFundingCycleMetadata = {
    reservedRate: BigNumber.from(1),
    redemptionRate: BigNumber.from(2),
    allowMinting: true,
    global: {
      pauseTransfers: true,
    },
  }
  const mockUpcomingFundingCycle = {
    weight: BigNumber.from(3),
    discountRate: BigNumber.from(4),
  }
  const mockUpcomingFundingCycleMetadata = {
    reservedRate: BigNumber.from(3),
    redemptionRate: BigNumber.from(4),
    allowMinting: false,
    global: {
      pauseTransfers: false,
    },
  }

  beforeEach(() => {
    ;(computeIssuanceRate as jest.Mock).mockReturnValue('mockedIssuanceRate')
    ;(formatDiscountRate as jest.Mock).mockReturnValue('mockedDiscountRate')
    ;(formatIssuanceRate as jest.Mock).mockReturnValue('mockedIssuanceRate')
    ;(formatRedemptionRate as jest.Mock).mockReturnValue('mockedRedemptionRate')
    ;(formatReservedRate as jest.Mock).mockReturnValue('mockedReservedRate')
    ;(formattedNum as jest.Mock).mockReturnValue('mockedFormattedNumber')
    ;(pairToDatum as jest.Mock).mockImplementation(
      (name, current, upcoming) => ({ name, current, upcoming }),
    )
    ;(flagPairToDatum as jest.Mock).mockImplementation(
      (name, current, upcoming) => ({ name, current, upcoming }),
    )
  })

  it('calculates the correct values', () => {
    const { result } = renderHook(() =>
      useFormatConfigurationTokenSection({
        fundingCycle: mockFundingCycle as any,
        fundingCycleMetadata: mockFundingCycleMetadata as any,
        tokenSymbol: 'mockedTokenSymbol',
        upcomingFundingCycle: mockUpcomingFundingCycle as any,
        upcomingFundingCycleMetadata: mockUpcomingFundingCycleMetadata as any,
      }),
    )

    expect(pairToDatum).toHaveBeenCalledTimes(5)
    expect(flagPairToDatum).toHaveBeenCalledTimes(2)

    expect(result.current.totalIssueanceRate).toEqual({
      name: 'Total issuance rate',
      current: 'mockedFormattedNumber mockedTokenSymbol/ETH',
      upcoming: 'mockedFormattedNumber mockedTokenSymbol/ETH',
    })
    expect(result.current.payerIssuanceRate).toEqual({
      name: 'Payer issuance rate',
      current: 'mockedIssuanceRate mockedTokenSymbol/ETH',
      upcoming: 'mockedIssuanceRate mockedTokenSymbol/ETH',
    })
    expect(result.current.issueanceReductionRate).toEqual({
      name: 'Issuance reduction rate',
      current: 'mockedDiscountRate%',
      upcoming: 'mockedDiscountRate%',
    })
    expect(result.current.redemptionRate).toEqual({
      name: 'Redemption rate',
      current: 'mockedRedemptionRate%',
      upcoming: 'mockedRedemptionRate%',
    })
    expect(result.current.reservedRate).toEqual({
      name: 'Reserved rate',
      current: 'mockedReservedRate%',
      upcoming: 'mockedReservedRate%',
    })

    expect(result.current.ownerTokenMintingRate).toEqual({
      name: 'Owner token minting',
      current: mockFundingCycleMetadata.allowMinting,
      upcoming: mockUpcomingFundingCycleMetadata.allowMinting,
    })
    expect(result.current.tokenTransfers).toEqual({
      name: 'Token transfers',
      current: !mockFundingCycleMetadata.global.pauseTransfers,
      upcoming: !mockUpcomingFundingCycleMetadata.global.pauseTransfers,
    })
  })
})
