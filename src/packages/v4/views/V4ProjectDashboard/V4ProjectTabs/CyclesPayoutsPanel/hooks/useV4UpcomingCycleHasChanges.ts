import { useMemo } from "react"
import { useV4CurrentUpcomingConfigurationPanel } from "./useV4CurrentUpcomingConfigurationPanel"

export const useV4UpcomingCycleHasChanges = () => {
  const data = useV4CurrentUpcomingConfigurationPanel('upcoming')

  const loading = useMemo(
    () =>
      Object.values(data).some(value =>
        Object.values(value ?? {}).some(v => v.new === undefined),
      ),
    [data],
  )

  const hasChanges = useMemo(
    () =>
      Object.values(data).some(value => {
        return Object.values(value ?? {}).some(v => v.old !== v.new)
      }),
    [data],
  )

  return {
    loading,
    hasChanges
  }
}
