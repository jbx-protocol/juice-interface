/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { useCycleSection } from './useCycleSection'
import { useFormatConfigurationCyclesSection } from './useFormatConfigurationCyclesSection'

jest.mock('components/ProjectDashboard/hooks')
jest.mock('hooks/v2v3/contractReader/useProjectDistributionLimit')
jest.mock('hooks/v2v3/contractReader/useProjectUpcomingFundingCycle')
jest.mock('./useFormatConfigurationCyclesSection')

describe('useCycleSection', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls the dependent hooks correctly', () => {
    ;(useProjectMetadata as jest.Mock).mockReturnValue({
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

    expect(useProjectMetadata).toHaveBeenCalled()
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
