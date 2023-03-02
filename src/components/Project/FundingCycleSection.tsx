import { Trans } from '@lingui/macro'
import { Space } from 'antd'

import { useState } from 'react'

import SectionHeader from 'components/SectionHeader'
import { Tab } from 'components/Tab'

export type TabType = {
  key: string
  label: string | JSX.Element
  content: JSX.Element
}

export default function FundingCycleSection({
  tabs,
  reconfigureButton,
}: {
  tabs: TabType[]
  reconfigureButton: JSX.Element | null
}) {
  const [selectedTabKey, setSelectedTabKey] = useState<string>(tabs[0]?.key)

  const currentTabContent = tabs.find(
    tab => tab.key === selectedTabKey,
  )?.content

  return (
    <Space direction="vertical" className="w-full">
      <div
        className="flex flex-wrap justify-between"
        style={{
          columnGap: 5,
        }}
      >
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

        {reconfigureButton}
      </div>

      <Space className="mb-5 text-sm" size="large">
        {tabs.map(tab => (
          <Tab
            key={tab.key}
            name={tab.label}
            isSelected={selectedTabKey === tab.key}
            onClick={() => setSelectedTabKey(tab.key)}
          />
        ))}
      </Space>

      {currentTabContent && <div>{currentTabContent}</div>}
    </Space>
  )
}
