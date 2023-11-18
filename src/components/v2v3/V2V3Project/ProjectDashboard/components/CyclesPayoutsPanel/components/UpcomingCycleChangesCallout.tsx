import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { useCurrentUpcomingConfigurationPanel } from '../hooks/useConfigurationPanel/useCurrentUpcomingConfigurationPanel'

export const UpcomingCycleChangesCallout = () => {
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
  const text = hasChanges
    ? t`This cycle has upcoming changes`
    : t`This cycle has no upcoming changes`

  if (loading) return null

  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-lg py-2 px-3.5 text-sm font-medium shadow-sm',
        hasChanges
          ? 'bg-split-50 text-split-800 dark:bg-split-950 dark:text-split-300'
          : 'border-bluebs-100 bg-bluebs-25 text-bluebs-700 dark:border-bluebs-800 dark:bg-bluebs-950 dark:text-bluebs-400',
      )}
    >
      <InformationCircleIcon className="h-5 w-5" />
      {text}
    </div>
  )
}
