import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetByChain } from 'packages/v4/hooks/useJBRulesetByChain'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4FormatConfigurationExtensionSection } from './useV4FormatConfigurationExtensionSection'

export const useV4ExtensionSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData | null => {
  const { selectedChainId } = useCyclesPanelSelectedChain()

  const { rulesetMetadata } = useJBRulesetByChain(selectedChainId)
  const { 
    rulesetMetadata: upcomingRulesetMetadata, 
  } = useJBUpcomingRuleset(selectedChainId)


  return useV4FormatConfigurationExtensionSection({
    rulesetMetadata,
    upcomingRulesetMetadata,
    ...(type === 'current' && {
      upcomingRulesetMetadata: null,
    }),
  })
}
