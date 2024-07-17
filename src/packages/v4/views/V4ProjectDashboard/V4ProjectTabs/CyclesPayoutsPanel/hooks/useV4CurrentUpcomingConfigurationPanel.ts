import { useV4CycleSection } from './useV4CycleSection'
import { useV4OtherRulesSection } from './useV4OtherRulesSection'
import { useV4TokenSection } from './useV4TokenSection'


export const useV4CurrentUpcomingConfigurationPanel = (
  type: 'current' | 'upcoming',
) => {
  const cycle = useV4CycleSection(type)
  const token = useV4TokenSection(type)
  const otherRules = useV4OtherRulesSection(type)
  // const extension = useExtensionSection(type)

  return {
    cycle,
    token,
    otherRules,
    // extension,
  }
}
