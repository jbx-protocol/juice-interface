import { useCycleSection } from './useCycleSection'
import { useExtensionSection } from './useExtensionSection.ts'
import { useOtherRulesSection } from './useOtherRulesSection'
import { useTokenSection } from './useTokenSection'

export const useCurrentUpcomingConfigurationPanel = (
  type: 'current' | 'upcoming',
) => {
  const cycle = useCycleSection(type)
  const token = useTokenSection(type)
  const otherRules = useOtherRulesSection(type)
  const extension = useExtensionSection(type)

  return {
    cycle,
    token,
    otherRules,
    extension,
  }
}
