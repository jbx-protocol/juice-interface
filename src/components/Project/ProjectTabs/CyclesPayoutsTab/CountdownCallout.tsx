import { ClockIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useCountdownClock } from 'components/Project/hooks/useCountdownClock'
import { twMerge } from 'tailwind-merge'

export function CountdownCallout({
  cycleStart,
}: {
  cycleStart: number | undefined
}) {
  const { remainingTimeText } = useCountdownClock(cycleStart)

  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-lg py-2 px-3.5 text-sm font-medium shadow-sm',
        'border-bluebs-100 bg-bluebs-25 text-bluebs-700 dark:border-bluebs-800 dark:bg-bluebs-950 dark:text-bluebs-400',
      )}
    >
      <ClockIcon className="h-5 w-5" />
      <Trans>Starts in {remainingTimeText}</Trans>
    </div>
  )
}
