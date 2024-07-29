import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRuleset, useJBRulesetMetadata, useJBTokenContext } from 'juice-sdk-react'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useV4FormatConfigurationTokenSection } from './useV4FormatConfigurationTokenSection'

export const useV4TokenSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { token } = useJBTokenContext()
  const tokenSymbol = token?.data?.symbol

  const { data: ruleset } = useJBRuleset()
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const { 
    ruleset: upcomingRuleset, 
    rulesetMetadata: upcomingRulesetMetadata, 
    isLoading: upcomingRulesetLoading 
  } = useJBUpcomingRuleset()

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
