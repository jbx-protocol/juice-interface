import { useJBRuleset, useJBRulesetMetadata, useJBTokenContext } from 'juice-sdk-react'

import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4FormatConfigurationTokenSection } from './useV4FormatConfigurationTokenSection'

export const useV4TokenSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { token } = useJBTokenContext()
  const tokenSymbol = token?.data?.symbol

  const { selectedChainId } = useCyclesPanelSelectedChain()

  // !!!!!!!!v4TODO: let these take optional chainId (SDK) and pass selectedChainId
  const { data: ruleset } = useJBRuleset()
  const { data: rulesetMetadata } = useJBRulesetMetadata()

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
