import { Space } from 'antd'
import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'

import { useContext, useState } from 'react'

import SectionHeader from 'components/SectionHeader'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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

      <Space style={{ fontSize: '.8rem', marginBottom: 12 }} size="middle">
        {tabs.map(tab => (
          <div
            key={tab.key}
            style={{
              textTransform: 'uppercase',
              cursor: 'pointer',
              ...(tab.key === selectedTabKey
                ? { color: colors.text.secondary, fontWeight: 600 }
                : { color: colors.text.tertiary, fontWeight: 500 }),
            }}
            className="hover-text-secondary"
            role="button"
            onClick={() => setSelectedTabKey(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </Space>

      {currentTabContent && <div>{currentTabContent}</div>}
    </div>
  )
}
