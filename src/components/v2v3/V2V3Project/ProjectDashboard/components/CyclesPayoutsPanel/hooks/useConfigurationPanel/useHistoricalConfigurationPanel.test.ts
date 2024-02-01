/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks'
import { useHistoricalConfigurationPanel } from './useHistoricalConfigurationPanel'

// Mock the hooks you used inside your custom hook
jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext',
  () => ({
    useProjectContext: () => ({
      primaryETHTerminal: 'mockTerminal',
      tokenSymbol: 'mockTokenSymbol',
    }),
  }),
)
jest.mock('contexts/shared/ProjectMetadataContext', () => ({
  useProjectMetadataContext: () => ({
    projectId: 'mockProjectId',
  }),
}))

jest.mock('hooks/v2v3/contractReader/useProjectDistributionLimit', () => ({
  __esModule: true,
  default: () => ({
    data: ['mockDistributionLimit', 'mockDistributionLimitCurrency'],
  }),
}))

jest.mock('./useFormatConfigurationCyclesSection', () => ({
  __esModule: true,
  useFormatConfigurationCyclesSection: () => 'mockCycle',
}))

jest.mock('./useFormatConfigurationTokenSection', () => ({
  __esModule: true,
  useFormatConfigurationTokenSection: () => 'mockToken',
}))

jest.mock('./useFormatConfigurationOtherRulesSection', () => ({
  __esModule: true,
  useFormatConfigurationOtherRulesSection: () => 'mockOtherRules',
}))

describe('useHistoricalConfigurationPanel', () => {
  const mockFundingCycle = {
    configuration: 'mockConfiguration',
  }
  const mockMetadata = {
    id: 'mockId',
  }
  it('returns expected data', () => {
    const { result } = renderHook(() =>
      useHistoricalConfigurationPanel({
        fundingCycle: mockFundingCycle as any,
        metadata: mockMetadata as any,
      }),
    )

    // Check if all returned data are as expected
    expect(result.current.cycle).toBe('mockCycle')
    expect(result.current.token).toBe('mockToken')
    expect(result.current.otherRules).toBe('mockOtherRules')
  })
})
