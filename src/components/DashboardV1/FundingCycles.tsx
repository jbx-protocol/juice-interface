import { Space } from 'antd'
import { t } from '@lingui/macro'
import { CardSection } from 'components/shared/CardSection'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { OperatorPermission, useHasPermission } from 'hooks/HasPermission'
import { useContext, useState } from 'react'

import CurrentFundingCycle from '../FundingCycle/CurrentFundingCycle'
import QueuedFundingCycle from '../FundingCycle/QueuedFundingCycle'
import FundingHistory from './FundingHistory'
import SectionHeader from './SectionHeader'
import ReconfigureFundingModalTrigger from '../FundingCycle/ReconfigureFundingModalTrigger'

type TabOption = 'current' | 'upcoming' | 'history'

export default function FundingCycles({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const [selectedTab, setSelectedTab] = useState<TabOption>('current')
  const [hoverTab, setHoverTab] = useState<TabOption>()

  const { projectId, currentFC } = useContext(ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const tab = (option: TabOption) => {
    let text: string
    switch (option) {
      case 'current':
        text = t`Current`
        break
      case 'upcoming':
        text = t`Upcoming`
        break
      case 'history':
        text = t`History`
        break
    }
    return (
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
        {text}
      </div>
    )
  }

  let tabContent: JSX.Element

  switch (selectedTab) {
    case 'current':
      tabContent = <CurrentFundingCycle showCurrentDetail={showCurrentDetail} />
      break
    case 'upcoming':
      tabContent = <QueuedFundingCycle />
      break
    case 'history':
      tabContent = (
        <CardSection>
          <FundingHistory startId={currentFC?.basedOn} />
        </CardSection>
      )
      break
  }

  const canReconfigure = useHasPermission(OperatorPermission.Configure)

  if (!projectId) return null

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
          text={t`Funding cycle`}
          tip={t`A project's lifetime is defined in funding cycles. If a funding target is set, the project can withdraw no more than the target for the duration of the cycle.`}
          style={{
            marginBottom: 12,
          }}
        />
        <Space style={{ fontSize: '.8rem', marginBottom: 12 }} size="middle">
          {tab('current')}
          {currentFC?.duration.gt(0) ? tab('upcoming') : null}
          {tab('history')}
        </Space>
      </div>
      <div>{tabContent}</div>

      {canReconfigure && <ReconfigureFundingModalTrigger />}
    </div>
  )
}
