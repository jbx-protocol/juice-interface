/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { usePayoutsSubPanel } from './usePayoutsSubPanel'

jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext',
)
jest.mock('contexts/shared/ProjectMetadataContext')

describe('usePayoutsSubPanel', () => {
  const DefaultProjectContext = {
    payoutSplits: [
      {
        beneficiary: '0x000000',
        percent: BigInt(100000000),
      },
      {
        beneficiary: '0x000001',
        percent: BigInt(200000000),
        projectId: BigInt(1),
      },
    ],
    distributionLimit: parseWad('100'),
    distributionLimitCurrency: BigInt(V2V3_CURRENCY_ETH),
    primaryETHTerminalFee: BigInt(10),
    balanceInDistributionLimitCurrency: parseWad('100'),
  }
  const DefaultUseProjectMetadata = {
    projectId: BigInt(1),
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
    [BigInt(0), '0%'],
    [BigInt(MAX_DISTRIBUTION_LIMIT), '10%'],
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
