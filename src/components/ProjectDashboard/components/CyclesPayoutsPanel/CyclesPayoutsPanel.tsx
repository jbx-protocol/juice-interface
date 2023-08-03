import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { useMemo } from 'react'
import { CurrentUpcomingSubPanel } from './components/CurrentUpcomingSubPanel'
import { CyclesTab } from './components/CyclesTab'
import { HistorySubPanel } from './components/HistorySubPanel'

export type CyclesSubPanel = {
  id: 'current' | 'upcoming' | 'history'
  name: string
}

export const CyclesPayoutsPanel = () => {
  const { fundingCycle } = useProjectContext()
  const tabs: CyclesSubPanel[] = useMemo(() => {
    const _tabs = [{ id: 'current', name: t`Current` }]
    if (fundingCycle?.duration && !fundingCycle.duration.eq(0)) {
      _tabs.concat({ id: 'upcoming', name: t`Upcoming` })
    }
    _tabs.concat({ id: 'history', name: t`History` })
    return _tabs as CyclesSubPanel[]
  }, [fundingCycle?.duration])
  return (
    <Tab.Group
      as="div"
      className="mx-auto flex w-full max-w-[596px] flex-col gap-5"
    >
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
