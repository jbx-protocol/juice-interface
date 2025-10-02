import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetByChain } from 'packages/v4v5/hooks/useJBRulesetByChain'
import { useJBUpcomingRuleset } from 'packages/v4v5/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4V5FormatConfigurationExtensionSection } from './useV4V5FormatConfigurationExtensionSection'

export const useV4V5ExtensionSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData | null => {
  const { selectedChainId } = useCyclesPanelSelectedChain()

  const { rulesetMetadata } = useJBRulesetByChain(selectedChainId)
  const { 
    rulesetMetadata: upcomingRulesetMetadata, 
  } = useJBUpcomingRuleset(selectedChainId)


  return useV4V5FormatConfigurationExtensionSection({
    rulesetMetadata,
    upcomingRulesetMetadata,
    ...(type === 'current' && {
      upcomingRulesetMetadata: null,
    }),
  })
}
