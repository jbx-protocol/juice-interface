import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { CyclesTab } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesTab'
import { forwardRef, useMemo } from 'react'
import { useV4V5CurrentUpcomingSubPanel } from '../../hooks/useV4V5CurrentUpcomingSubPanel'
import { V4V5CurrentUpcomingSubPanel } from './V4V5CurrentUpcomingSubPanel'

type V4V5CyclesSubPanel = {
  id: 'current' | 'upcoming' | 'history'
  name: string
}

export const V4V5CyclesPayoutsPanel = forwardRef<HTMLDivElement>((props, ref) => {
  const upcomingInfo = useV4V5CurrentUpcomingSubPanel('upcoming')
  const tabs: V4V5CyclesSubPanel[] = useMemo(() => {
    // If upcoming ruleset is cycle #1 (scheduled launch), hide "Current"
    if (!upcomingInfo.loading && upcomingInfo.rulesetNumber === 1) {
      return [{ id: 'upcoming', name: t`Upcoming` }]
    }
    return [
      { id: 'current', name: t`Current` },
      { id: 'upcoming', name: t`Upcoming` },
      // { id: 'history', name: t`History` },
    ]
  }, [upcomingInfo.loading, upcomingInfo.rulesetNumber])

  return (
    <Tab.Group as="div" ref={ref} className="relative flex w-full flex-col gap-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="mb-0 font-heading text-2xl font-medium">Rulesets</h2>
        {/* ProjectChainSelect is in V4CurrentUpcomingSubPanel */}
        <Tab.List className="flex gap-2">
          {tabs.map(tab => (
            <CyclesTab key={tab.id} name={tab.name} />
          ))}
        </Tab.List>
      </div>
      <Tab.Panels>
        {tabs.map(tab => (
          <Tab.Panel key={tab.id} className="outline-none">
            {tab.id === 'history' ? (
              <></> //<HistorySubPanel />
            ) : (
              <V4V5CurrentUpcomingSubPanel id={tab.id} />
            )}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
})

V4V5CyclesPayoutsPanel.displayName = 'V4V5CyclesPayoutsPanel'
