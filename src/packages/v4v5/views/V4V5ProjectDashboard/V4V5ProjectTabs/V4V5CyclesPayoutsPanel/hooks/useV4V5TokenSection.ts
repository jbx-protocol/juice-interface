import { useJBTokenContext } from 'juice-sdk-react'

import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetByChain } from 'packages/v4v5/hooks/useJBRulesetByChain'
import { useJBUpcomingRuleset } from 'packages/v4v5/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4V5FormatConfigurationTokenSection } from './useV4V5FormatConfigurationTokenSection'

export const useV4V5TokenSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { token } = useJBTokenContext()
  const tokenSymbol = token?.data?.symbol

  const { selectedChainId } = useCyclesPanelSelectedChain()

  const { ruleset, rulesetMetadata } = useJBRulesetByChain(selectedChainId)

  const { 
    ruleset: upcomingRuleset, 
    rulesetMetadata: upcomingRulesetMetadata, 
    isLoading: upcomingRulesetLoading 
  } = useJBUpcomingRuleset(selectedChainId)

  return useV4V5FormatConfigurationTokenSection({
    ruleset,
    rulesetMetadata,
    tokenSymbol,
    upcomingRuleset,
    upcomingRulesetMetadata,
    upcomingRulesetLoading,
    // Hide upcoming info from current section.
    ...(type === 'current' && {
      upcomingRuleset: null,
      upcomingRulesetMetadata: null,
    }),
  })
}
