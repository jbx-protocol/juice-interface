/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import { parseWad } from 'utils/format/formatNumber'
import { usePayoutsSubPanel } from './usePayoutsSubPanel'

jest.mock(
  'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext',
)
jest.mock('contexts/ProjectMetadataContext')

describe('usePayoutsSubPanel', () => {
  const DefaultProjectContext = {
    payoutSplits: [
      {
        beneficiary: '0x000000',
        percent: BigNumber.from(100000000),
      },
      {
        beneficiary: '0x000001',
        percent: BigNumber.from(200000000),
        projectId: BigNumber.from(1),
      },
    ],
    distributionLimit: parseWad('100'),
    distributionLimitCurrency: BigNumber.from(V2V3_CURRENCY_ETH),
    primaryETHTerminalFee: BigNumber.from(10),
    balanceInDistributionLimitCurrency: parseWad('100'),
  }
  const DefaultUseProjectMetadata = {
    projectId: BigNumber.from(1),
  }
  beforeEach(() => {
    ;(useProjectContext as jest.Mock).mockReturnValue(DefaultProjectContext)
    ;(useProjectMetadataContext as jest.Mock).mockReturnValue(
      DefaultUseProjectMetadata,
    )
  })

  it('returns undefined if payoutSplits is undefined', () => {
    ;(useProjectContext as jest.Mock).mockReturnValue({
      ...DefaultProjectContext,
      payoutSplits: undefined,
    })
    const { result } = renderHook(usePayoutsSubPanel, {
      initialProps: 'current',
    })
    expect(result.current.payouts).toBeUndefined()
  })

  it.each([
    [BigNumber.from(0), '0%'],
    [BigNumber.from(MAX_DISTRIBUTION_LIMIT), '10%'],
    [undefined, 'undefined'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ])('returns no amount if distributionLimit is %p', (distributionLimit, _) => {
    ;(useProjectContext as jest.Mock).mockReturnValue({
      ...DefaultProjectContext,
      distributionLimit,
    })
    const { result } = renderHook(usePayoutsSubPanel, {
      initialProps: 'current',
    })
    expect(result.current.payouts).toEqual([
      {
        address: '0x000001',
        amount: undefined,
        percent: '20%',
        projectId: 1,
      },
      {
        amount: undefined,
        address: '0x000000',
        percent: '10%',
      },
    ])
  })
})
