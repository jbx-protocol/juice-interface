import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { CyclesTab } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesTab'
import { RulesetCountdownProvider } from 'packages/v4/contexts/RulesetCountdownProvider'
import { useMemo } from 'react'
import { V4CurrentUpcomingSubPanel } from './V4CurrentUpcomingSubPanel'

type V4CyclesSubPanel = {
  id: 'current' | 'upcoming' | 'history'
  name: string
}

export const V4CyclesPayoutsPanel = () => {
  const tabs: V4CyclesSubPanel[] = useMemo(
    () => [
      { id: 'current', name: t`Current` },
      { id: 'upcoming', name: t`Upcoming` },
      // { id: 'history', name: t`History` },
    ],
    [],
  )
  return (
    <Tab.Group as="div" className="mx-auto flex w-full flex-col gap-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="mb-0 font-heading text-2xl font-medium">Cycle</h2>
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
              <RulesetCountdownProvider>
                <V4CurrentUpcomingSubPanel id={tab.id} />
              </RulesetCountdownProvider>
            )}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}
