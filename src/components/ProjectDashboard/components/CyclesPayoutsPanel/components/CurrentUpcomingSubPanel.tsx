import { t } from '@lingui/macro'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from '../../ui'
import { useCurrentUpcomingSubPanel } from '../hooks/useCurrentUpcomingSubPanel'
import { ConfigurationDisplayCard } from './ConfigurationDisplayCard'
import { PayoutsSubPanel } from './PayoutsSubPanel'

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

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <DisplayCard className="w-full max-w-[127px]">
            <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
              {topPanelsInfo[0].title}
              <div className="font-heading text-2xl font-medium dark:text-slate-50">
                {topPanelsInfo[0].value ?? <Skeleton />}
              </div>
            </div>
          </DisplayCard>
          <DisplayCard className="w-full max-w-[142px]">
            <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
              {topPanelsInfo[1].title}
              <div className="font-heading text-2xl font-medium dark:text-slate-50">
                {topPanelsInfo[1].value ?? <Skeleton className="w-22" />}
              </div>
            </div>
          </DisplayCard>
          <DisplayCard className="flex-1">
            <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
              {topPanelsInfo[2].title}
              <div className="font-heading text-2xl font-medium dark:text-slate-50">
                {topPanelsInfo[2].value ?? <Skeleton className="w-40" />}
              </div>
            </div>
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
