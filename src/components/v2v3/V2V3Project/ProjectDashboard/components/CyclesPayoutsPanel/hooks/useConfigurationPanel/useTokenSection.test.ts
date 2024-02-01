/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks'
import { useOtherRulesSection } from './useOtherRulesSection'

// Mock the hooks used inside your custom hook
jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext',
  () => ({
    useProjectContext: () => ({
      fundingCycleMetadata: 'mockFundingCycleMetadata',
    }),
  }),
)

jest.mock('contexts/shared/ProjectMetadataContext', () => ({
  useProjectMetadataContext: () => ({
    projectId: 'mockProjectId',
  }),
}))

jest.mock('hooks/v2v3/contractReader/useProjectUpcomingFundingCycle', () => ({
  __esModule: true,
  useProjectUpcomingFundingCycle: () => ({
    data: ['mockUpcomingFundingCycle', 'mockUpcomingFundingCycleMetadata'],
  }),
}))

jest.mock('./useFormatConfigurationOtherRulesSection', () => ({
  __esModule: true,
  useFormatConfigurationOtherRulesSection: () =>
    'mockFormatConfigurationOtherRulesSection',
}))

describe('useOtherRulesSection', () => {
  it('returns expected data for current type', () => {
    const { result } = renderHook(() => useOtherRulesSection('current'))

    // Check if returned data is as expected
    expect(result.current).toBe('mockFormatConfigurationOtherRulesSection')
  })

  it('returns expected data for upcoming type', () => {
    const { result } = renderHook(() => useOtherRulesSection('upcoming'))

    // Check if returned data is as expected
    expect(result.current).toBe('mockFormatConfigurationOtherRulesSection')
  })
})
