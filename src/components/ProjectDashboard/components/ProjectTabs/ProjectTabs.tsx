import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { Fragment, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { AboutPanel } from '../AboutPanel'
import { ActivityPanel } from '../ActivityPanel'
import { CyclesPayoutsPanel } from '../CyclesPayoutsPanel'
import { NftRewardsPanel } from '../NftRewardsPanel'
import { TokensPanel } from '../TokensPanel'
import { ProjectTab } from '../ui'

export const ProjectTabs = ({ className }: { className?: string }) => {
  const tabs = useMemo(
    () => [
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
      { id: 'activity', name: t`Activity`, panel: <ActivityPanel /> },
    ],
    [],
  )

  return (
    <div className={twMerge('flex flex-col items-center gap-12', className)}>
      <Tab.Group as={Fragment}>
        <div className="flex w-full justify-center border-b border-grey-200">
          <Tab.List className="flex gap-8">
            {tabs.map(tab => (
              <ProjectTab key={tab.id} name={tab.name} />
            ))}
          </Tab.List>
        </div>
        <Tab.Panels as={Fragment}>
          {tabs.map(tab => (
            <Tab.Panel as={Fragment} key={tab.id}>
              {tab.panel}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
