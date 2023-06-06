import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { ConfigurationPanelTableData } from '../../components/ConfigurationPanel'
import { useFormatConfigurationCyclesSection } from './useFormatConfigurationCyclesSection'

export const useCycleSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { projectId } = useProjectMetadata()

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
