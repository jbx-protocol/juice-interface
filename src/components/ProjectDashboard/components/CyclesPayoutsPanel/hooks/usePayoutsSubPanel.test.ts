/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { BigNumber } from 'ethers'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { usePayoutsSubPanel } from './usePayoutsSubPanel'

jest.mock('components/ProjectDashboard/hooks')

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
  }
  beforeEach(() => {
    ;(useProjectContext as jest.Mock).mockReturnValue(DefaultProjectContext)
  })

  it('returns undefined if payoutSplits is undefined', () => {
    ;(useProjectContext as jest.Mock).mockReturnValue({
      ...DefaultProjectContext,
      payoutSplits: undefined,
    })
    const { result } = renderHook(usePayoutsSubPanel)
    expect(result.current.payouts).toBeUndefined()
  })
  it('returns payouts sorted by percent', () => {
    const { result } = renderHook(usePayoutsSubPanel)
    expect(result.current.payouts).toEqual([
      {
        address: '0x000001',
        amount: 'Ξ20',
        percent: '20%',
        projectId: 1,
      },
      {
        amount: 'Ξ10',
        address: '0x000000',
        percent: '10%',
      },
    ])
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
    const { result } = renderHook(usePayoutsSubPanel)
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
