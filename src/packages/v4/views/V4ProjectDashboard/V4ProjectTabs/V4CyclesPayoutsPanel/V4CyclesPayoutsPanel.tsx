import { CyclesTab } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesTab'
import { Tab } from '@headlessui/react'
import { V4CurrentUpcomingSubPanel } from './V4CurrentUpcomingSubPanel'
import { t } from '@lingui/macro'
import { useMemo } from 'react'
import { useV4CurrentUpcomingSubPanel } from '../../hooks/useV4CurrentUpcomingSubPanel'

type V4CyclesSubPanel = {
  id: 'current' | 'upcoming' | 'history'
  name: string
}

export const V4CyclesPayoutsPanel = () => {
  const upcomingInfo = useV4CurrentUpcomingSubPanel('upcoming')
  const tabs: V4CyclesSubPanel[] = useMemo(() => {
    // If upcoming ruleset is cycle #1 (scheduled launch), hide "Current"
    if (!upcomingInfo.loading && upcomingInfo.rulesetNumber === 1) {
      return [
        { id: 'upcoming', name: t`Upcoming` },
      ]
    }
    return [
      { id: 'current', name: t`Current` },
      { id: 'upcoming', name: t`Upcoming` },
      // { id: 'history', name: t`History` },
    ]
  }, [upcomingInfo.loading, upcomingInfo.rulesetNumber])

  return (
    <>
      <Tab.Group as="div" className="mx-auto relative flex w-full flex-col gap-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="mb-0 font-heading text-2xl font-medium">Ruleset cycle</h2>
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
                <V4CurrentUpcomingSubPanel id={tab.id} />
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}
