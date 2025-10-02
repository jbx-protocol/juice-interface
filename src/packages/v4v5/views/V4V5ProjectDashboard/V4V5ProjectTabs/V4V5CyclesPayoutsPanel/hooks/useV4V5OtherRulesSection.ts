import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetByChain } from 'packages/v4v5/hooks/useJBRulesetByChain'
import { useJBUpcomingRuleset } from 'packages/v4v5/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4V5FormatConfigurationOtherRulesSection } from './useV4V5FormatConfigurationOtherRulesSection'

export const useV4V5OtherRulesSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { selectedChainId } = useCyclesPanelSelectedChain()

  const { rulesetMetadata } = useJBRulesetByChain(selectedChainId)
  const { 
    rulesetMetadata: upcomingRulesetMetadata, 
  } = useJBUpcomingRuleset(selectedChainId)

  return useV4V5FormatConfigurationOtherRulesSection({
    rulesetMetadata,
    upcomingRulesetMetadata,
    ...(type === 'current' && {
      upcomingRulesetMetadata: null,
    }),
  })
}
