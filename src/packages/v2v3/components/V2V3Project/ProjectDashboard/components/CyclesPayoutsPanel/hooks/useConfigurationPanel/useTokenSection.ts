import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectUpcomingFundingCycle } from 'packages/v2v3/hooks/contractReader/useProjectUpcomingFundingCycle'
import { useFormatConfigurationTokenSection } from './useFormatConfigurationTokenSection'

export const useTokenSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { projectId } = useProjectMetadataContext()
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
