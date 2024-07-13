import { useV4CycleSection } from './useV4CycleSection'


export const useV4CurrentUpcomingConfigurationPanel = (
  type: 'current' | 'upcoming',
) => {
  const cycle = useV4CycleSection(type)
  // const token = useTokenSection(type)
  // const otherRules = useOtherRulesSection(type)
  // const extension = useExtensionSection(type)

  return {
    cycle,
    // token,
    // otherRules,
    // extension,
  }
}
