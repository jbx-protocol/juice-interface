import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { ConfigurationPanelTableData } from '../../components/ConfigurationPanel'
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
