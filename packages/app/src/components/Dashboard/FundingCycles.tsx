import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import { FundingCycle } from 'models/funding-cycle'
import React, { useContext, useState } from 'react'

import FundingCyclePreview from './FundingCyclePreview'
import FundingHistory from './FundingHistory'
import QueuedFundingCycle from './QueuedFundingCycle'
import Tappable from './Tappable'

type TabOption = 'current' | 'upcoming' | 'history'

export default function FundingCycles({
  projectId,
  fundingCycle,
  balanceInCurrency,
  showCurrentDetail,
  isOwner,
}: {
  projectId: BigNumber
  fundingCycle: FundingCycle | undefined
  balanceInCurrency: BigNumber | undefined
  showCurrentDetail?: boolean
  isOwner?: boolean
}) {
  const [selectedTab, setSelectedTab] = useState<TabOption>('current')
  const [hoverTab, setHoverTab] = useState<TabOption>()

  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)

  const tab = (option: TabOption) => (
    <div
      style={{
        textTransform: 'uppercase',
        cursor: 'pointer',
        ...(option === selectedTab
          ? { color: colors.text.secondary, fontWeight: 600 }
          : { color: colors.text.tertiary, fontWeight: 500 }),
        ...(option === hoverTab ? { color: colors.text.secondary } : {}),
      }}
      onClick={() => setSelectedTab(option)}
      onMouseEnter={() => setHoverTab(option)}
      onMouseLeave={() => setHoverTab(undefined)}
    >
      {option}
    </div>
  )

  let tabContent: JSX.Element

  switch (selectedTab) {
    case 'current':
      tabContent = (
        <div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Tappable
              projectId={projectId}
              fundingCycle={fundingCycle}
              balanceInCurrency={balanceInCurrency}
            />
            <FundingCyclePreview
              fundingCycle={fundingCycle}
              showDetail={showCurrentDetail}
            />
          </Space>
        </div>
      )
      break
    case 'upcoming':
      tabContent = (
        <QueuedFundingCycle
          isOwner={isOwner}
          projectId={projectId}
          currentCycle={fundingCycle}
        />
      )
      break
    case 'history':
      tabContent = <FundingHistory startId={fundingCycle?.previous} />
      break
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <TooltipLabel
          style={{
            color: colors.text.header,
            fontWeight:
              forThemeOption &&
              forThemeOption({
                [ThemeOption.light]: 600,
                [ThemeOption.dark]: 400,
              }),
          }}
          label="Funding cycle"
          tip="A project's lifetime is defined in funding cycles. Each funding cycle has a duration and funding target. During each cycle, a project can withdraw no more than the target—any extra funds paid is overflow."
        />
        <Space style={{ fontSize: '.8rem' }} size="middle">
          {tab('current')}
          {tab('upcoming')}
          {tab('history')}
        </Space>
      </div>
      <CardSection padded>{tabContent}</CardSection>
    </div>
  )
}
