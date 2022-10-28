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
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <SectionHeader
          text={<Trans>Funding cycle</Trans>}
          tip={
            <Trans>
              A project's lifetime is defined in funding cycles. If a funding
              target is set, the project can withdraw no more than the target
              for the duration of the cycle.
            </Trans>
          }
          style={{
            marginBottom: 10,
          }}
        />

        {reconfigureButton}
      </div>

      <Space style={{ fontSize: '.8rem', marginBottom: 20 }} size="middle">
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
    </div>
  )
}
