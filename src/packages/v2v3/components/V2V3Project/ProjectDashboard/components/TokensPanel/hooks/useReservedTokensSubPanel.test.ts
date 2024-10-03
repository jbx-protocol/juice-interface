/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectReservedTokens } from 'packages/v2v3/hooks/contractReader/ProjectReservedTokens'
import { useReservedTokensSubPanel } from './useReservedTokensSubPanel'

jest.mock(
  'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext',
)
jest.mock('contexts/ProjectMetadataContext')
jest.mock('packages/v2v3/hooks/contractReader/ProjectReservedTokens')

describe('useReservedTokensSubPanel', () => {
  const DefaultProjectMetadata = {
    projectId: 1,
  }
  const DefaultProjectContext = {
    projectOwnerAddress: '0x0000000000000000000000000000000000000000',
    fundingCycleMetadata: {
      reservedRate: 10000,
    },
    reservedTokensSplits: [
      {
        beneficiary: '0x123',
        percent: 10000000,
      },
      {
        beneficiary: '0x456',
        percent: 20000000,
      },
    ],
  }
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useProjectMetadataContext as jest.Mock).mockReturnValue(
      DefaultProjectMetadata,
    )
    ;(useProjectContext as jest.Mock).mockReturnValue(DefaultProjectContext)
    ;(useProjectReservedTokens as jest.Mock).mockReturnValue({
      data: BigNumber.from('1000000000000000000'),
    })
  })
  it('returns undefined reservedList when reservedTokensSplits is undefined', () => {
    ;(useProjectContext as jest.Mock).mockReturnValue({
      ...DefaultProjectContext,
      reservedTokensSplits: undefined,
    })
    const { result } = renderHook(useReservedTokensSubPanel)
    expect(result.current.reservedList).toBeUndefined()
  })

  it('returns sorted reservedList when reservedTokensSplits is defined', () => {
    const { result } = renderHook(useReservedTokensSubPanel)
    expect(result.current.reservedList).toEqual([
      {
        projectId: 0,
        address: '0x0000000000000000000000000000000000000000',
        percent: '97%',
      },
      {
        projectId: undefined,
        address: '0x456',
        percent: '2%',
      },
      {
        projectId: undefined,
        address: '0x123',
        percent: '1%',
      },
    ])
  })

  it('returns undefined when reservedRateWad is undefined', () => {
    ;(useProjectContext as jest.Mock).mockReturnValue({
      ...DefaultProjectContext,
      fundingCycleMetadata: {
        reservedRate: undefined,
      },
    })
    const { result } = renderHook(useReservedTokensSubPanel)
    expect(result.current.reservedRate).toBeUndefined()
  })

  it('returns formatted reservedRate when reservedRateWad is defined', () => {
    const { result } = renderHook(useReservedTokensSubPanel)
    expect(result.current.reservedRate).toEqual('100%')
  })

  it('returns undefined when reservedTokensWad is undefined', () => {
    ;(useProjectReservedTokens as jest.Mock).mockReturnValue({
      data: undefined,
    })
    const { result } = renderHook(useReservedTokensSubPanel)
    expect(result.current.reservedTokens).toBeUndefined()
  })

  it('returns formatted reservedTokens when reservedTokensWad is defined', () => {
    const { result } = renderHook(useReservedTokensSubPanel)
    expect(result.current.reservedTokens).toEqual('1')
  })
})
