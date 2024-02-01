import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'

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
