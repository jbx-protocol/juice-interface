import { useJBTokenContext } from 'juice-sdk-react'

import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetByChain } from 'packages/v4/hooks/useJBRulesetByChain'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4FormatConfigurationTokenSection } from './useV4FormatConfigurationTokenSection'

export const useV4TokenSection = (
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

  return useV4FormatConfigurationTokenSection({
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
