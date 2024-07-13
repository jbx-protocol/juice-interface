import { useMemo } from "react"
import { useCurrentUpcomingConfigurationPanel } from "./useCurrentUpcomingConfigurationPanel"

export const useV2V3UpcomingCycleHasChanges = () => {
  const data = useCurrentUpcomingConfigurationPanel('upcoming')

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
