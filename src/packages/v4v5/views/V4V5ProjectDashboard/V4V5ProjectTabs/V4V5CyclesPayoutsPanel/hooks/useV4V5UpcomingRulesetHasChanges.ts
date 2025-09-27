import { useMemo } from "react"
import { useV4V5CurrentUpcomingConfigurationPanel } from "./useV4V5CurrentUpcomingConfigurationPanel"

export const useV4V5UpcomingRulesetHasChanges = () => {
  const data = useV4V5CurrentUpcomingConfigurationPanel('upcoming')

  const loading = useMemo(
    () =>
      Object.values(data).some(value =>
        Object.values(value ?? {}).some(v => v.new === undefined),
      ),
    [data],
  )

  const hasChanges = useMemo(
    () => {
      const changedItems: unknown[] = []
      
      const result = Object.values(data).some(value => {
        return Object.values(value ?? {}).some(v => {
          if (v.name === 'Start time') {
            return false
          }
          
          if (v.old !== v.new) {
            changedItems.push({
              old: v.old,
              new: v.new,
              item: v
            })
            return true
          }
          return false
        })
      })
      return result
    },
    [data],
  )

  return {
    loading,
    hasChanges
  }
}
