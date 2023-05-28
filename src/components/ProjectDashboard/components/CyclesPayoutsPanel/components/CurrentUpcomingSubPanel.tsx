import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { useMemo } from 'react'
import { DisplayCard } from '../../ui'
import { useCurrentUpcomingSubPanel } from '../hooks/useCurrentUpcomingSubPanel'
import { PayoutsSubPanel } from './PayoutsSubPanel'

export const CurrentUpcomingSubPanel = ({
  id,
}: {
  id: 'current' | 'upcoming'
}) => {
  const info = useCurrentUpcomingSubPanel(id)

  const topPanelsInfo = useMemo(() => {
    if (info.loading) return
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
    info.loading,
    info.remainingTime,
    info.status,
    info.type,
  ])
  const bottomPanelTitle = useMemo(() => {
    if (info.loading) return
    if (info.type === 'current') {
      return t`Current cycle`
    }
    return t`Upcoming cycle`
  }, [info.loading, info.type])

  return (
    <div>
      {info.loading ? (
        <CycleSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <DisplayCard className="w-full max-w-[127px]">
              <div className="flex flex-col gap-2 text-sm font-medium text-grey-600">
                {topPanelsInfo![0].title}
                <div className="font-heading text-2xl font-medium">
                  {topPanelsInfo![0].value}
                </div>
              </div>
            </DisplayCard>
            <DisplayCard className="w-full max-w-[142px]">
              <div className="flex flex-col gap-2 text-sm font-medium text-grey-600">
                {topPanelsInfo![1].title}
                <div className="font-heading text-2xl font-medium">
                  {topPanelsInfo![1].value}
                </div>
              </div>
            </DisplayCard>
            <DisplayCard className="flex-1">
              <div className="flex flex-col gap-2 text-sm font-medium text-grey-600">
                {topPanelsInfo![2].title}
                <div className="font-heading text-2xl font-medium">
                  {topPanelsInfo![2].value}
                </div>
              </div>
            </DisplayCard>
          </div>
          <DisplayCard>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2 text-sm font-medium text-grey-600">
                {bottomPanelTitle}
                <div className="font-heading text-2xl font-medium">
                  <Trans>Configuration</Trans>
                </div>
              </div>
              <ChevronDownIcon className="h-6 w-6" />
            </div>
          </DisplayCard>
        </div>
      )}

      <PayoutsSubPanel className="mt-12" />
    </div>
  )
}

/**
 * @name CycleSkeleton
 * @description A skeleton for the cycle panel
 */
const CycleSkeleton = () => (
  <div data-testid="cycle-skeleton" className="flex flex-col gap-4">
    <div className="flex gap-4">
      <DisplayCard className="w-full max-w-[127px]">
        <div className="flex flex-col gap-3 text-sm font-medium text-grey-600">
          <div className="h-4 w-20 rounded-lg bg-smoke-200" />
          <div className="h-8 w-12 rounded-lg bg-smoke-200 font-heading" />
        </div>
      </DisplayCard>
      <DisplayCard className="w-full max-w-[142px]">
        <div className="flex flex-col gap-3 text-sm font-medium text-grey-600">
          <div className="h-4 w-20 rounded-lg bg-smoke-200" />
          <div className="w-22 h-8 rounded-lg bg-smoke-200 font-heading" />
        </div>
      </DisplayCard>
      <DisplayCard className="flex-1">
        <div className="flex flex-col gap-3 text-sm font-medium text-grey-600">
          <div className="h-4 w-20 rounded-lg bg-smoke-200" />
          <div className="h-8 w-40 rounded-lg bg-smoke-200 font-heading" />
        </div>
      </DisplayCard>
    </div>
    <DisplayCard>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3 text-sm font-medium text-grey-600">
          <div className="h-4 w-32 rounded-lg bg-smoke-200" />
          <div className="h-8 w-40 rounded-lg bg-smoke-200 font-heading" />
        </div>
        <ChevronDownIcon className="h-6 w-6" />
      </div>
    </DisplayCard>
  </div>
)
