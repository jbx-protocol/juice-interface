import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import useProjectDistributionLimit from 'packages/v2v3/hooks/contractReader/useProjectDistributionLimit'
import { useProjectUpcomingFundingCycle } from 'packages/v2v3/hooks/contractReader/useProjectUpcomingFundingCycle'
import { useFormatConfigurationCyclesSection } from './useFormatConfigurationCyclesSection'

export const useCycleSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { projectId } = useProjectMetadataContext()

  const {
    fundingCycle,
    distributionLimit,
    distributionLimitCurrency,
    primaryETHTerminal,
  } = useProjectContext()
  const { data: upcomingFundingCycleData } = useProjectUpcomingFundingCycle({
    projectId,
  })
  const [upcomingFundingCycle] = upcomingFundingCycleData ?? []

  const { data: upcomingDistributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: upcomingFundingCycle?.configuration.toString(),
    terminal: primaryETHTerminal,
  })
  const [upcomingDistributionLimit, upcomingDistributionLimitCurrency] =
    upcomingDistributionLimitData ?? []

  return useFormatConfigurationCyclesSection({
    fundingCycle,
    distributionLimitAmountCurrency: {
      distributionLimit: distributionLimit,
      currency: distributionLimitCurrency,
    },

    upcomingFundingCycle,
    upcomingDistributionLimitAmountCurrency: {
      distributionLimit: upcomingDistributionLimit,
      currency: upcomingDistributionLimitCurrency,
    },

    // Hide upcoming info from current section.
    ...(type === 'current' && {
      upcomingFundingCycle: null,
      upcomingDistributionLimitAmountCurrency: null,
    }),
  })
}
