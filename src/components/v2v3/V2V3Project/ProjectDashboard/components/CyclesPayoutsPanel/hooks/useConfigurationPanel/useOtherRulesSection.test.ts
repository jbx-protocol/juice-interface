/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { useOtherRulesSection } from './useOtherRulesSection'

jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext',
)
jest.mock('contexts/shared/ProjectMetadataContext')

jest.mock('hooks/v2v3/contractReader/useProjectUpcomingFundingCycle', () => ({
  useProjectUpcomingFundingCycle: jest.fn(),
}))

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

const DefaultProjectContext = {
  fundingCycleMetadata: {
    pausePay: false,
    holdFees: false,
    allowTerminalMigration: false,
    allowControllerMigration: false,
    global: {
      allowSetTerminals: false,
      allowSetController: false,
    },
  },
} as any
const DefaultProjectMetadata = {
  projectId: '1',
} as any
const DefaultProjectUpcomingFundingCycle = {
  data: [
    {},
    {
      pausePay: false,
      holdFees: false,
      allowTerminalMigration: false,
      allowControllerMigration: false,
      global: {
        allowSetTerminals: false,
        allowSetController: false,
      },
    },
  ],
} as any

describe('useOtherRulesSection', () => {
  beforeEach(() => {
    mockUseProjectContext.mockReturnValue(DefaultProjectContext)
    mockUseProjectMetadata.mockReturnValue(DefaultProjectMetadata)
    mockUseProjectUpcomingFundingCycle.mockReturnValue(
      DefaultProjectUpcomingFundingCycle,
    )
  })

  describe.each([
    'paymentsToThisProject',
    'holdFees',
    'setPaymentTerminals',
    'setController',
    'migratePaymentTerminal',
    'migrateController',
  ])('%p', key => {
    it('should return new only for %p if current', () => {
      const { result } = renderHook(useOtherRulesSection, {
        initialProps: 'current',
      })
      expect(result.current[key].old).toBeUndefined()
      expect(result.current[key].new).toBeDefined()
    })

    it('should return new and old for %p if upcoming', () => {
      const { result } = renderHook(useOtherRulesSection, {
        initialProps: 'upcoming',
      })
      expect(result.current[key].old).toBeDefined()
      expect(result.current[key].new).toBeDefined()
    })

    it('respects undefined values', () => {
      mockUseProjectContext.mockReturnValue({
        fundingCycleMetadata: {
          pausePay: undefined,
          holdFees: undefined,
          allowTerminalMigration: undefined,
          allowControllerMigration: undefined,
          global: {
            allowSetTerminals: undefined,
            allowSetController: undefined,
          },
        },
      } as any)
      mockUseProjectUpcomingFundingCycle.mockReturnValue({
        data: [
          {},
          {
            pausePay: undefined,
            holdFees: undefined,
            allowTerminalMigration: undefined,
            allowControllerMigration: undefined,
            global: {
              allowSetTerminals: undefined,
              allowSetController: undefined,
            },
          },
        ],
      } as any)

      const { result } = renderHook(useOtherRulesSection, {
        initialProps: 'upcoming',
      })
      expect(result.current[key].old).toBeUndefined()
      expect(result.current[key].new).toBeUndefined()
    })
  })
})
