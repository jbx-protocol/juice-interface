import { Trans } from '@lingui/macro'
import SectionHeader from 'components/SectionHeader'
import { Tab } from 'components/Tab'
import { useState } from 'react'

type TabType = {
  key: string
  label: string | JSX.Element
  content: JSX.Element
}

export default function FundingCycleSection({
  tabs,
  reconfigureButton,
  hideTitle,
}: {
  tabs: TabType[]
  reconfigureButton: JSX.Element | null
  hideTitle?: boolean
}) {
  const [selectedTabKey, setSelectedTabKey] = useState<string>(tabs[0]?.key)

  const currentTabContent = tabs.find(
    tab => tab.key === selectedTabKey,
  )?.content

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap justify-between gap-2">
        {hideTitle ? (
          <div />
        ) : (
          <SectionHeader
            className="mb-2"
            text={<Trans>Cycle</Trans>}
            tip={
              <Trans>
                A project's rules are locked for the duration of each cycle. If
                the cycle has no duration, the project's rules can change at any
                time.
              </Trans>
            }
          />
        )}

        {reconfigureButton}
      </div>

      <div className="mb-5 flex gap-6 text-sm">
        {tabs.map(tab => (
          <Tab
            key={tab.key}
            name={tab.label}
            isSelected={selectedTabKey === tab.key}
            onClick={() => setSelectedTabKey(tab.key)}
          />
        ))}
      </div>

      {currentTabContent && <div>{currentTabContent}</div>}
    </div>
  )
}
