import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { Fragment, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { AboutPanel } from '../AboutPanel'
import { ActivityPanel } from '../ActivityPanel'
import { CyclesPayoutsPanel } from '../CyclesPayoutsPanel'
import { NftRewardsPanel } from '../NftRewardsPanel'
import { TokensPanel } from '../TokensPanel'
import { ProjectTab } from '../ui'

export const ProjectTabs = ({ className }: { className?: string }) => {
  const { projectPageTab, setProjectPageTab } = useProjectPageQueries()

  const tabs = useMemo(
    () => [
      { id: 'activity', name: t`Activity`, panel: <ActivityPanel /> },
      { id: 'about', name: t`About`, panel: <AboutPanel /> },
      {
        id: 'nft_rewards',
        name: t`NFTs & Rewards`,
        panel: <NftRewardsPanel />,
      },
      {
        id: 'cycle_payouts',
        name: t`Cycles & Payouts`,
        panel: <CyclesPayoutsPanel />,
      },
      { id: 'tokens', name: t`Tokens`, panel: <TokensPanel /> },
    ],
    [],
  )

  const selectedTabIndex = useMemo(() => {
    const idx = tabs.findIndex(tab => tab.id === projectPageTab)
    return idx === -1 ? undefined : idx
  }, [projectPageTab, tabs])

  return (
    <div className={twMerge('flex flex-col items-center gap-12', className)}>
      <Tab.Group
        as={Fragment}
        selectedIndex={selectedTabIndex}
        defaultIndex={0}
      >
        <div className="flex w-full snap-x overflow-x-scroll border-b border-grey-200 dark:border-slate-600 sm:justify-center md:justify-center">
          <Tab.List className="flex gap-8">
            {tabs.map(tab => (
              <ProjectTab
                key={tab.id}
                name={tab.name}
                onClick={() => setProjectPageTab(tab.id)}
              />
            ))}
          </Tab.List>
        </div>
        <div className="flex w-full justify-center px-4 md:px-0">
          <Tab.Panels as={Fragment}>
            {tabs.map(tab => (
              <Tab.Panel as={Fragment} key={tab.id}>
                {tab.panel}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  )
}
