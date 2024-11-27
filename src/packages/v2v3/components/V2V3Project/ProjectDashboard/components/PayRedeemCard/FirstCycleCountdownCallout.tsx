import { ClockIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useCountdownClock } from 'components/Project/hooks/useCountdownClock'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectUpcomingFundingCycle } from 'packages/v2v3/hooks/contractReader/useProjectUpcomingFundingCycle'
import { twMerge } from 'tailwind-merge'

export function FirstCycleCountdownCallout() {
  const { projectId } = useProjectMetadataContext()

  // inefficient extra call, but meh
  const fc = useProjectUpcomingFundingCycle({ projectId })
  const start = fc?.data?.[0]?.start?.toNumber()
  const { remainingTimeText } = useCountdownClock(start)

  if (!start) {
    return null
  }
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-lg py-2 px-3.5 text-sm font-medium shadow-sm',
        'border-warning-100 bg-warning-25 text-warning-700 dark:border-warning-800 dark:bg-warning-950 dark:text-warning-400',
      )}
    >
      <ClockIcon className="h-5 w-5" />
      <Trans>Payments open in {remainingTimeText}</Trans>
    </div>
  )
}
