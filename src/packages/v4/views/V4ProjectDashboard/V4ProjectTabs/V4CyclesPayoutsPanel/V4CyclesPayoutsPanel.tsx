import { t } from '@lingui/macro'

import { Tab } from '@headlessui/react'
import { CyclesTab } from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesTab'
import { ProjectChainSelect } from 'packages/v4/components/ProjectDashboard/ProjectChainSelect'
import { useMemo } from 'react'
import { V4CurrentUpcomingSubPanel } from './V4CurrentUpcomingSubPanel'
import { useCyclesPanelSelectedChain } from './contexts/CyclesPanelSelectedChainContext'

type V4CyclesSubPanel = {
  id: 'current' | 'upcoming' | 'history'
  name: string
}

export const V4CyclesPayoutsPanel = () => {
  const { selectedChainId, setSelectedChainId } = useCyclesPanelSelectedChain()

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
        <div className="flex gap-2">
          <h2 className="mb-0 font-heading text-2xl font-medium">Ruleset cycle</h2>
          { selectedChainId ? 
            <ProjectChainSelect 
              value={selectedChainId} 
              onChange={(chainId) => setSelectedChainId(chainId)} 
            />
          : null }
        </div>
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
  )
}
