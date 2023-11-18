import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectMetadata'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { ConfigurationPanelTableData } from '../../components/ConfigurationPanel'
import { useFormatConfigurationExtensionSection } from './useFormatConfigurationExtensionSection'

export const useExtensionSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData | null => {
  const { projectId } = useProjectMetadata()

  const { fundingCycleMetadata } = useProjectContext()
  const { data: upcomingFundingCycleData } = useProjectUpcomingFundingCycle({
    projectId,
  })
  const [, upcomingFundingCycleMetadata] = upcomingFundingCycleData ?? []

  return useFormatConfigurationExtensionSection({
    fundingCycleMetadata,
    upcomingFundingCycleMetadata,
    ...(type === 'current' && {
      upcomingFundingCycleMetadata: null,
    }),
  })
}
