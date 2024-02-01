/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { useCurrentUpcomingSubPanel } from './useCurrentUpcomingSubPanel'

jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext',
)
jest.mock('contexts/shared/ProjectMetadataContext')
jest.mock('hooks/v2v3/contractReader/useProjectUpcomingFundingCycle')

const mockUseProjectContext = useProjectContext as jest.MockedFunction<
  typeof useProjectContext
>
const mockUseProjectMetadata = useProjectMetadataContext as jest.MockedFunction<
  typeof useProjectMetadataContext
>
const mockUseProjectUpcomingFundingCycle =
  useProjectUpcomingFundingCycle as jest.MockedFunction<
    typeof useProjectUpcomingFundingCycle
  >

describe('useCurrentUpcomingSubPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Prime the mocks with default values
    mockUseProjectContext.mockImplementation(
      () =>
        ({
          fundingCycle: {
            duration: BigNumber.from(1),
            number: BigNumber.from(1),
            start: BigNumber.from(1),
          },
          loading: { fundingCycleLoading: false },
        } as any),
    )
    mockUseProjectMetadata.mockImplementation(() => ({ projectId: 1 } as any))
    mockUseProjectUpcomingFundingCycle.mockImplementation(
      () =>
        ({
          data: [{ duration: BigNumber.from(1) }],
          loading: false,
        } as any),
    )
  })
  it('returns current cycle number if type is current', () => {
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('current'))
    expect(result.current.cycleNumber).toEqual(1)
  })

  it('returns upcoming cycle number if type is upcoming', () => {
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('upcoming'))
    expect(result.current.cycleNumber).toEqual(2)
  })

  test('upcoming cycleLength is formatted correctly', () => {
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('upcoming'))
    expect(result.current.cycleLength).toEqual('1 Second')
  })

  test.each(['current', 'upcoming'] as const)(
    'status always returns Locked',
    id => {
      const { result } = renderHook(() => useCurrentUpcomingSubPanel(id))
      expect(result.current.status).toEqual('Locked')
    },
  )

  test('status is open when duration is 0', () => {
    mockUseProjectContext.mockImplementation(
      () =>
        ({
          fundingCycle: {
            duration: BigNumber.from(0),
            number: BigNumber.from(1),
            start: BigNumber.from(1),
          },
          loading: { fundingCycleLoading: false },
        } as any),
    )
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('current'))
    expect(result.current.status).toEqual('Unlocked')
  })

  test('current type doesnt wait for upcoming funding cycle', () => {
    mockUseProjectContext.mockImplementation(
      () =>
        ({
          fundingCycle: {
            duration: BigNumber.from(1),
            number: BigNumber.from(1),
            start: BigNumber.from(1),
          },
          loading: { fundingCycleLoading: false },
        } as any),
    )
    mockUseProjectUpcomingFundingCycle.mockImplementation(
      () =>
        ({
          data: [{ duration: BigNumber.from(1) }],
          loading: true,
        } as any),
    )
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('current'))
    expect(result.current.loading).toEqual(false)
  })

  test('upcoming type waits for upcoming funding cycle', () => {
    mockUseProjectContext.mockImplementation(
      () =>
        ({
          fundingCycle: {
            duration: BigNumber.from(1),
            number: BigNumber.from(1),
            start: BigNumber.from(1),
          },
          loading: { fundingCycleLoading: false },
        } as any),
    )
    mockUseProjectUpcomingFundingCycle.mockImplementation(
      () =>
        ({
          data: [{ duration: BigNumber.from(1) }],
          loading: true,
        } as any),
    )
    const { result } = renderHook(() => useCurrentUpcomingSubPanel('upcoming'))
    expect(result.current.loading).toEqual(true)
  })
})
