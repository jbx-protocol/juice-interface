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
    <Space direction="vertical" className="w-full">
      <div
        className="flex flex-wrap justify-between"
        style={{
          columnGap: 5,
        }}
      >
        {hideTitle ? (
          <div />
        ) : (
          <SectionHeader
            className="mb-2"
            text={<Trans>Funding cycle</Trans>}
            tip={
              <Trans>
                A project's lifetime is defined in funding cycles. If a funding
                target is set, the project can withdraw no more than the target
                for the duration of the cycle.
              </Trans>
            }
          />
        )}

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
