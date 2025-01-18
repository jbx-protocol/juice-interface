import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetMetadata } from 'juice-sdk-react'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4FormatConfigurationExtensionSection } from './useV4FormatConfigurationExtensionSection'

export const useV4ExtensionSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData | null => {
  const { selectedChainId } = useCyclesPanelSelectedChain()

  // !!!!!!!!v4TODO: let this take optional chainId (SDK) and pass selectedChainId
  const { data: rulesetMetadata } = useJBRulesetMetadata()
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
