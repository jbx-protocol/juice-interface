import { JBRulesetData, JBRulesetMetadata } from 'juice-sdk-core'
import { useV4V5FormatCycleSection } from './useV4V5FormatCycleSection'
import { useV4V5FormatTokenSection } from './useV4V5FormatTokenSection'
import { useV4V5FormatOtherRulesSection } from './useV4V5FormatOtherRulesSection'
import { useV4V5FormatExtensionSection } from './useV4V5FormatExtensionSection'

export const useV4V5CycleConfigurationPanel = (
  ruleset: JBRulesetData | undefined,
  rulesetMetadata: JBRulesetMetadata | undefined,
) => {
  const cycle = useV4V5FormatCycleSection(ruleset)
  const token = useV4V5FormatTokenSection(ruleset, rulesetMetadata)
  const otherRules = useV4V5FormatOtherRulesSection(rulesetMetadata)
  const extension = useV4V5FormatExtensionSection(rulesetMetadata)

  return {
    cycle,
    token,
    otherRules,
    extension,
  }
}
