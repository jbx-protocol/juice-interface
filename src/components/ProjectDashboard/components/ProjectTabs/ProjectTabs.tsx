import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import { useOnScreen } from 'hooks/useOnScreen'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { AboutPanel } from '../AboutPanel'
import { ActivityPanel } from '../ActivityPanel'
import { CyclesPayoutsPanel } from '../CyclesPayoutsPanel'
import { NftRewardsPanel } from '../NftRewardsPanel'
import { TokensPanel } from '../TokensPanel'
import { ProjectTab } from '../ui'

export const ProjectTabs = ({ className }: { className?: string }) => {
  const { projectPageTab, setProjectPageTab } = useProjectPageQueries()

  const { value: showNftRewards } = useHasNftRewards()

  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const isPanelVisible = useOnScreen(panelRef)
  const [firstRender, setFirstRender] = useState(true)

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false)
      return
    }
    if (
      containerRef.current &&
      !isPanelVisible &&
      projectPageTab !== undefined
    ) {
      containerRef.current.scrollIntoView(true)
    }

    // Intentionally only set - isPanelVisible updates should not cause a
    // re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectPageTab])

  const tabs = useMemo(
    () => [
      { id: 'activity', name: t`Activity`, panel: <ActivityPanel /> },
      { id: 'about', name: t`About`, panel: <AboutPanel /> },
      {
        id: 'nft_rewards',
        name: t`NFTs & Rewards`,
        panel: <NftRewardsPanel />,
        hideTab: !showNftRewards,
      },
      {
        id: 'cycle_payouts',
        name: t`Cycles & Payouts`,
        panel: <CyclesPayoutsPanel />,
      },
      { id: 'tokens', name: t`Tokens`, panel: <TokensPanel /> },
    ],
    [showNftRewards],
  )

  const selectedTabIndex = useMemo(() => {
    const idx = tabs.findIndex(tab => tab.id === projectPageTab)
    return idx === -1 ? undefined : idx
  }, [projectPageTab, tabs])

  return (
    <div
      ref={containerRef}
      className={twMerge('flex flex-col items-center gap-12', className)}
    >
      <Tab.Group
        as={Fragment}
        selectedIndex={selectedTabIndex}
        defaultIndex={0}
      >
        <div className="sticky top-0 flex w-full snap-x overflow-x-scroll border-b border-grey-200 bg-white pt-8 hide-scrollbar dark:border-slate-600 dark:bg-slate-900 sm:justify-center md:z-10 md:justify-center">
          <Tab.List className="flex gap-8">
            {tabs.map(tab => (
              <ProjectTab
                className={twMerge(tab.hideTab && 'hidden')}
                key={tab.id}
                name={tab.name}
                onClick={() => setProjectPageTab(tab.id)}
              />
            ))}
          </Tab.List>
        </div>
        <div ref={panelRef} className="flex w-full justify-center px-4 md:px-0">
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
