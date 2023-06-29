import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'

export const useCurrentUpcomingDistributionLimit = (
  type: 'current' | 'upcoming',
) => {
  const { projectId } = useProjectMetadata()
  const {
    primaryETHTerminal,
    distributionLimit: currentDistributionLimit,
    distributionLimitCurrency: currentDistributionLimitCurrency,
  } = useProjectContext()

  const {
    data: upcomingFundingCycleData,
    loading: upcomingFundingCycleLoading,
  } = useProjectUpcomingFundingCycle({ projectId })
  const [upcomingFundingCycle] = upcomingFundingCycleData ?? []

  const {
    data: upcomingDistributionLimitData,
    loading: upcomingDistributionLimitLoading,
  } = useProjectDistributionLimit({
    projectId,
    configuration: upcomingFundingCycle?.configuration.toString(),
    terminal: primaryETHTerminal,
  })

  const [upcomingDistributionLimit, upcomingDistributionLimitCurrency] =
    upcomingDistributionLimitData ?? []

  if (type === 'current') {
    return {
      distributionLimit: currentDistributionLimit,
      distributionLimitCurrency: currentDistributionLimitCurrency,
      loading: false,
    }
  }
  return {
    distributionLimit: upcomingDistributionLimit,
    distributionLimitCurrency: upcomingDistributionLimitCurrency,
    loading: upcomingFundingCycleLoading || upcomingDistributionLimitLoading,
  }
}
