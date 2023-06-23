import { Trans, t } from '@lingui/macro'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { TitleDescriptionDisplayCard } from '../../ui/TitleDescriptionDisplayCard'
import { useCurrentUpcomingSubPanel } from '../hooks/useCurrentUpcomingSubPanel'
import { ConfigurationDisplayCard } from './ConfigurationDisplayCard'
import { currentCycleRemainingLengthTooltip } from './CyclesPanelTooltips'
import { PayoutsSubPanel } from './PayoutsSubPanel'

const CYCLE_NUMBER_INDEX = 0
const STATUS_INDEX = 1
const CYCLE_LENGTH_INDEX = 2

export const CurrentUpcomingSubPanel = ({
  id,
}: {
  id: 'current' | 'upcoming'
}) => {
  const info = useCurrentUpcomingSubPanel(id)

  const topPanelsInfo = useMemo(() => {
    const topPanelInfo = [
      {
        title: t`Cycle #`,
        value: info.cycleNumber,
      },
      {
        title: t`Status`,
        value: info.status,
      },
    ]
    if (info.type === 'current') {
      topPanelInfo.push({
        title: t`Remaining time`,
        value: info.remainingTime,
      })
    }
    if (info.type === 'upcoming') {
      topPanelInfo.push({
        title: t`Cycle length`,
        value: info.cycleLength,
      })
    }
    return topPanelInfo
  }, [
    info.cycleLength,
    info.cycleNumber,
    info.remainingTime,
    info.status,
    info.type,
  ])

  const cycleLengthTooltip =
    info.type === 'current' ? currentCycleRemainingLengthTooltip : undefined

  const cycleStatusValue = topPanelsInfo[STATUS_INDEX].value

  const cycleStatusTooltip = (
    <Trans>
      This project's rules will be locked in place for {cycleStatusValue} days.
    </Trans>
  )

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 md:flex">
          <TitleDescriptionDisplayCard
            className="w-full md:max-w-[127px]"
            title={topPanelsInfo[CYCLE_NUMBER_INDEX].title}
            description={
              topPanelsInfo[CYCLE_NUMBER_INDEX].value ?? <Skeleton />
            }
          />
          <TitleDescriptionDisplayCard
            className="w-full md:w-fit"
            title={topPanelsInfo[STATUS_INDEX].title}
            description={
              topPanelsInfo[STATUS_INDEX].value ?? <Skeleton className="w-22" />
            }
            tooltip={cycleStatusTooltip}
          />
          <TitleDescriptionDisplayCard
            className="col-span-2 md:flex-1"
            title={topPanelsInfo[CYCLE_LENGTH_INDEX].title}
            description={
              topPanelsInfo[CYCLE_LENGTH_INDEX].value ?? (
                <Skeleton className="w-40" />
              )
            }
            tooltip={cycleLengthTooltip}
          />
        </div>
        <ConfigurationDisplayCard type={info.type} />
      </div>

      <PayoutsSubPanel className="mt-12" type={id} />
    </div>
  )
}

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={twMerge(
      'h-8 w-12 animate-pulse rounded-lg bg-smoke-200 dark:bg-slate-500',
      className,
    )}
  />
)
