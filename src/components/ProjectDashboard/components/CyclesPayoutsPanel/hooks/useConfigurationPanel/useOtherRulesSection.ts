import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { ConfigurationPanelTableData } from '../../components/ConfigurationPanel'
import { useFormatConfigurationOtherRulesSection } from './useFormatConfigurationOtherRulesSection'

export const useOtherRulesSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { projectId } = useProjectMetadata()

  const { fundingCycleMetadata } = useProjectContext()
  const { data: upcomingFundingCycleData } = useProjectUpcomingFundingCycle({
    projectId,
  })
  const [, upcomingFundingCycleMetadata] = upcomingFundingCycleData ?? []

  return useFormatConfigurationOtherRulesSection({
    fundingCycleMetadata,
    upcomingFundingCycleMetadata,
    ...(type === 'current' && {
      upcomingFundingCycleMetadata: null,
    }),
  })
}
