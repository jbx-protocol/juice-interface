import { useJBProjectId, useJBUpcomingRuleset } from 'juice-sdk-react'

import { ClockIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { useCountdownClock } from 'components/Project/hooks/useCountdownClock'

export function FirstCycleCountdownCallout() {
  const { projectId, chainId } = useJBProjectId()
  const upcomingRuleset = useJBUpcomingRuleset({ projectId, chainId })
  const start = (upcomingRuleset?.ruleset?.start ?? 0) / 1000 // Convert milliseconds to seconds
  const { remainingTimeText } = useCountdownClock(start)

  if (!start) {
    return null
  }
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-lg mb-2 py-2 px-3.5 text-sm font-medium shadow-sm',
        'border-warning-100 bg-warning-25 text-warning-700 dark:border-warning-800 dark:bg-warning-950 dark:text-warning-400',
      )}
    >
      <ClockIcon className="h-5 w-5" />
      <Trans>Payments open in {remainingTimeText}</Trans>
    </div>
  )
}
