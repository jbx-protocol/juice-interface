import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import useProjectDistributionLimit from 'packages/v2v3/hooks/contractReader/useProjectDistributionLimit'
import { useProjectUpcomingFundingCycle } from 'packages/v2v3/hooks/contractReader/useProjectUpcomingFundingCycle'

export const useCurrentUpcomingDistributionLimit = (
  type: 'current' | 'upcoming',
) => {
  const { projectId } = useProjectMetadataContext()
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
