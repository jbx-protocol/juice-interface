import { Tab } from '@headlessui/react'
import { t } from '@lingui/macro'
import { ProjectTab } from 'components/Project/ProjectTabs/ProjectTab'
import { useOnScreen } from 'hooks/useOnScreen'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useProjectPageQueries } from '../hooks/useProjectPageQueries'
import V4AboutPanel from './V4AboutPanel'
import { V4ActivityPanel } from './V4ActivityPanel/V4ActivityPanel'
import { V4CyclesPayoutsPanel } from './V4CyclesPayoutsPanel/V4CyclesPayoutsPanel'
import { V4NftRewardsPanel } from './V4NftRewardsPanel/V4NftRewardsPanel'
import { V4TokensPanel } from './V4TokensPanel/V4TokensPanel'

type ProjectTabConfig = {
  id: string
  name: JSX.Element | string
  panel: JSX.Element | string
  hideTab?: boolean
}

export const V4ProjectTabs = ({ className }: { className?: string }) => {
  const { projectPageTab, setProjectPageTab } = useProjectPageQueries()

  const showNftRewards = true

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

  const tabs: ProjectTabConfig[] = useMemo(
    () => [
      { id: 'activity', name: t`Activity`, panel: <V4ActivityPanel /> },
      { id: 'about', name: t`About`, panel: <V4AboutPanel /> },
      {
        id: 'nft_rewards',
        name: t`NFTs`,
        panel: <V4NftRewardsPanel />,
        hideTab: !showNftRewards,
      },
      {
        id: 'cycle_payouts',
        name: t`Rulesets & Payouts`,
        panel: <V4CyclesPayoutsPanel />,
      },
      { id: 'tokens', name: t`Tokens`, panel: <V4TokensPanel /> },
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
        <div className="sticky top-20 z-10 flex w-full snap-x overflow-x-scroll border-b border-grey-200 bg-white hide-scrollbar dark:border-slate-600 dark:bg-slate-900 sm:justify-center md:static md:z-10 md:justify-center md:pt-8">
          <Tab.List className="flex w-full gap-10">
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
