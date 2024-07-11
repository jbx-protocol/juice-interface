import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { twMerge } from 'tailwind-merge'

export const UpcomingCycleChangesCallout = ({
  text,
  hasChanges,
  loading,
}: {
  text: JSX.Element | string
  hasChanges: Boolean,
  loading: Boolean
}) => {
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
