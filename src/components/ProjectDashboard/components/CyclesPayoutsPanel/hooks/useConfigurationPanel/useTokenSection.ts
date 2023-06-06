import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { ConfigurationPanelTableData } from '../../components/ConfigurationPanel'
import { useFormatConfigurationTokenSection } from './useFormatConfigurationTokenSection'

export const useTokenSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { projectId } = useProjectMetadata()

  const {
    fundingCycle,
    fundingCycleMetadata,
    tokenSymbol: tokenSymbolRaw,
  } = useProjectContext()
  const { data: upcomingFundingCycleData } = useProjectUpcomingFundingCycle({
    projectId,
  })
  const [upcomingFundingCycle, upcomingFundingCycleMetadata] =
    upcomingFundingCycleData ?? []

  return useFormatConfigurationTokenSection({
    fundingCycle,
    fundingCycleMetadata,
    tokenSymbol: tokenSymbolRaw,
    upcomingFundingCycle,
    upcomingFundingCycleMetadata,
    // Hide upcoming info from current section.
    ...(type === 'current' && {
      upcomingFundingCycle: null,
      upcomingFundingCycleMetadata: null,
    }),
  })
}
