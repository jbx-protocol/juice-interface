import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetByChain } from 'packages/v4/hooks/useJBRulesetByChain'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4FormatConfigurationOtherRulesSection } from './useV4FormatConfigurationOtherRulesSection'

export const useV4OtherRulesSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { selectedChainId } = useCyclesPanelSelectedChain()

  const { rulesetMetadata } = useJBRulesetByChain(selectedChainId)
  const { 
    rulesetMetadata: upcomingRulesetMetadata, 
  } = useJBUpcomingRuleset(selectedChainId)

  return useV4FormatConfigurationOtherRulesSection({
    rulesetMetadata,
    upcomingRulesetMetadata,
    ...(type === 'current' && {
      upcomingRulesetMetadata: null,
    }),
  })
}
