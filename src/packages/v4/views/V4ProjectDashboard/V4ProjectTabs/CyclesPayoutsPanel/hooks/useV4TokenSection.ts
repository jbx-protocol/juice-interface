import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import useNameOfERC20 from 'hooks/ERC20/useNameOfERC20'
import { useJBRuleset, useJBRulesetMetadata, useReadJbTokensTokenOf } from 'juice-sdk-react'
import { useJBQueuedRuleset } from 'packages/v4/hooks/useJBQueuedRuleset'
import { useV4FormatConfigurationTokenSection } from './useV4FormatConfigurationTokenSection'

export const useV4TokenSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: tokenSymbolRaw } = useNameOfERC20(tokenAddress)

  const { data: ruleset } = useJBRuleset()
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const { ruleset: queuedRuleset, rulesetMetadata: queuedRulesetMetadata } = useJBQueuedRuleset()

  return useV4FormatConfigurationTokenSection({
    ruleset,
    rulesetMetadata: rulesetMetadata ? {
      allowAddAccountingContext: false, // @todo: remove when next contracts deployed
      allowAddPriceFeed: false, // @todo: remove when next contracts deployed
      ...rulesetMetadata,
    }: undefined,
    tokenSymbol: tokenSymbolRaw,
    queuedRuleset,
    queuedRulesetMetadata,
    // Hide upcoming info from current section.
    ...(type === 'current' && {
      queuedRuleset: null,
      queuedRulesetMetadata: null,
    }),
  })
}
