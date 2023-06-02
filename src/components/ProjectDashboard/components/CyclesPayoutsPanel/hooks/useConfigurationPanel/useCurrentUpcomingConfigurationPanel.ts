import { useCycleSection } from './useCycleSection'
import { useOtherRulesSection } from './useOtherRulesSection'
import { useTokenSection } from './useTokenSection'

export const useCurrentUpcomingConfigurationPanel = (
  type: 'current' | 'upcoming',
) => {
  const cycle = useCycleSection(type)
  const token = useTokenSection(type)
  const otherRules = useOtherRulesSection(type)

  return {
    cycle,
    token,
    otherRules,
  }
}
