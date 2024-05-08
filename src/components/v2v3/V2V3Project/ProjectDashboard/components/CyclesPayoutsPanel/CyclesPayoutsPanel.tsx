import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useMemo } from 'react'
import { CurrentUpcomingSubPanel } from './components/CurrentUpcomingSubPanel'
import { CyclesTab } from './components/CyclesTab'
import { HistorySubPanel } from './components/HistorySubPanel'

type CyclesSubPanel = {
  id: 'current' | 'upcoming' | 'history'
  name: string
}

export const CyclesPayoutsPanel = () => {
  const tabs: CyclesSubPanel[] = useMemo(
    () => [
      { id: 'current', name: t`Current` },
      { id: 'upcoming', name: t`Upcoming` },
      { id: 'history', name: t`History` },
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
              <HistorySubPanel />
            ) : (
              <CurrentUpcomingSubPanel id={tab.id} />
            )}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}
