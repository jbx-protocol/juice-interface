/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import useProjectDistributionLimit from 'packages/v2v3/hooks/contractReader/useProjectDistributionLimit'
import { useProjectUpcomingFundingCycle } from 'packages/v2v3/hooks/contractReader/useProjectUpcomingFundingCycle'
import { useCycleSection } from './useCycleSection'
import { useFormatConfigurationCyclesSection } from './useFormatConfigurationCyclesSection'

jest.mock(
  'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext',
)
jest.mock('contexts/ProjectMetadataContext')
jest.mock('packages/v2v3/hooks/contractReader/useProjectDistributionLimit')
jest.mock('packages/v2v3/hooks/contractReader/useProjectUpcomingFundingCycle')
jest.mock('./useFormatConfigurationCyclesSection')

describe('useCycleSection', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls the dependent hooks correctly', () => {
    ;(useProjectMetadataContext as jest.Mock).mockReturnValue({
      projectId: 'projectIdMock',
    })
    ;(useProjectContext as jest.Mock).mockReturnValue({
      fundingCycle: {},
      distributionLimit: 'limitMock',
      distributionLimitCurrency: 'currencyMock',
      primaryETHTerminal: 'terminalMock',
    })
    ;(useProjectUpcomingFundingCycle as jest.Mock).mockReturnValue({
      data: [{ configuration: 'configurationMock' }],
    })
    ;(useProjectDistributionLimit as jest.Mock).mockReturnValue({
      data: ['upcomingLimitMock', 'upcomingCurrencyMock'],
    })
    ;(useFormatConfigurationCyclesSection as jest.Mock).mockReturnValue({})

    renderHook(() => useCycleSection('current'))

    expect(useProjectMetadataContext).toHaveBeenCalled()
    expect(useProjectContext).toHaveBeenCalled()
    expect(useProjectUpcomingFundingCycle).toHaveBeenCalledWith({
      projectId: 'projectIdMock',
    })
    expect(useProjectDistributionLimit).toHaveBeenCalledWith({
      projectId: 'projectIdMock',
      configuration: 'configurationMock',
      terminal: 'terminalMock',
    })
    expect(useFormatConfigurationCyclesSection).toHaveBeenCalled()
  })
})
