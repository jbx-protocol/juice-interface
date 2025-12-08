import { ConfigurationPanel } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { JBRulesetData, JBRulesetMetadata } from 'juice-sdk-core'
import { useV4V5CycleConfigurationPanel } from './hooks/useV4V5CycleConfigurationPanel'

type V4V5CycleConfigurationPanelProps = {
  ruleset: JBRulesetData | undefined
  rulesetMetadata: JBRulesetMetadata | undefined
}

export const V4V5CycleConfigurationPanel: React.FC<
  V4V5CycleConfigurationPanelProps
> = ({ ruleset, rulesetMetadata }) => {
  const props = useV4V5CycleConfigurationPanel(ruleset, rulesetMetadata)
  return <ConfigurationPanel {...props} />
}
