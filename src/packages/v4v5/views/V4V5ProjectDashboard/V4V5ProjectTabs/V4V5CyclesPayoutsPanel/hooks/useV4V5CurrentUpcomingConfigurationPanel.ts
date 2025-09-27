import { useV4V5CycleSection } from './useV4V5CycleSection'
import { useV4V5ExtensionSection } from './useV4V5ExtensionSection'
import { useV4V5OtherRulesSection } from './useV4V5OtherRulesSection'
import { useV4V5TokenSection } from './useV4V5TokenSection'


export const useV4V5CurrentUpcomingConfigurationPanel = (
  type: 'current' | 'upcoming',
) => {
  const cycle = useV4V5CycleSection(type)
  const token = useV4V5TokenSection(type)
  const otherRules = useV4V5OtherRulesSection(type)
  const extension = useV4V5ExtensionSection(type)

  return {
    cycle,
    token,
    otherRules,
    extension,
  }
}
