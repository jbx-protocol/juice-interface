import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from '../../ui'
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
          <DisplayCard className="w-full md:max-w-[127px]">
            <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
              {topPanelsInfo[CYCLE_NUMBER_INDEX].title}
              <div className="font-heading text-xl font-medium text-grey-900 dark:text-slate-50">
                {topPanelsInfo[CYCLE_NUMBER_INDEX].value ?? <Skeleton />}
              </div>
            </div>
          </DisplayCard>
          <DisplayCard className="w-full md:w-fit">
            <Tooltip title={cycleStatusTooltip} placement="bottom">
              <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
                {topPanelsInfo[1].title}
                <div className="font-heading text-xl font-medium text-grey-900 dark:text-slate-50">
                  {topPanelsInfo[1].value ?? <Skeleton className="w-22" />}
                </div>
              </div>
            </Tooltip>
          </DisplayCard>
          <DisplayCard className="col-span-2 md:flex-1">
            <Tooltip title={cycleLengthTooltip}>
              <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
                {topPanelsInfo[CYCLE_LENGTH_INDEX].title}
                <div className="font-heading text-xl font-medium text-grey-900 dark:text-slate-50">
                  {topPanelsInfo[CYCLE_LENGTH_INDEX].value ?? (
                    <Skeleton className="w-40" />
                  )}
                </div>
              </div>
            </Tooltip>
          </DisplayCard>
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
