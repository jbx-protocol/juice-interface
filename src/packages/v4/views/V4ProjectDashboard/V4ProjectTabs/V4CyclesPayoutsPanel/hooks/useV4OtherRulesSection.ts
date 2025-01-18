import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetMetadata } from 'juice-sdk-react'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4FormatConfigurationOtherRulesSection } from './useV4FormatConfigurationOtherRulesSection'

export const useV4OtherRulesSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { selectedChainId } = useCyclesPanelSelectedChain()

  // !!!!!!!!v4TODO: let these take optional chainId (SDK) and pass selectedChainId
  const { data: rulesetMetadata } = useJBRulesetMetadata()
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
