import { Space, Tooltip } from 'antd'
import { t } from '@lingui/macro'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { CardSection } from 'components/shared/CardSection'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import {
  OperatorPermission,
  useHasPermission,
} from 'hooks/v1/contractReader/HasPermission'
import { useContext, useState } from 'react'

import { fundingCycleRiskCount } from 'utils/fundingCycle'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import CurrentFundingCycle from 'components/v1/FundingCycle/CurrentFundingCycle'
import QueuedFundingCycle from 'components/v1/FundingCycle/QueuedFundingCycle'

import FundingHistory from './FundingHistory'
import SectionHeader from '../SectionHeader'
import ReconfigureFundingModalTrigger from './ReconfigureFundingModalTrigger'

type TabOption = 'current' | 'upcoming' | 'history'

export default function FundingCycles({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const [selectedTab, setSelectedTab] = useState<TabOption>('current')
  const [hoverTab, setHoverTab] = useState<TabOption>()

  const { projectId, currentFC, queuedFC } = useContext(V1ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const tabText = ({
    text,
    fundingCycle,
  }: {
    text: string
    fundingCycle: V1FundingCycle | undefined
  }) => {
    return fundingCycle && fundingCycleRiskCount(fundingCycle) ? (
      <Tooltip
        title={t`This funding cycle may pose risks to contributors. Check the funding cycle details before paying this project.`}
      >
        <span>
          {text}
          <ExclamationCircleOutlined
            style={{
              color: colors.text.warn,
              marginLeft: 4,
            }}
          />
        </span>
      </Tooltip>
    ) : (
      text
    )
  }

  const tab = (option: TabOption) => {
    let text: string | JSX.Element
    switch (option) {
      case 'current':
        text = tabText({ text: t`Current`, fundingCycle: currentFC })
        break
      case 'upcoming':
        text = tabText({ text: t`Upcoming`, fundingCycle: queuedFC })
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
            marginBottom: 10,
          }}
        />
        {canReconfigure && (
          <ReconfigureFundingModalTrigger
            fundingDuration={currentFC?.duration}
          />
        )}
      </div>
      <Space style={{ fontSize: '.8rem', marginBottom: 12 }} size="middle">
        {tab('current')}
        {currentFC?.duration.gt(0) ? tab('upcoming') : null}
        {tab('history')}
      </Space>
      <div>{tabContent}</div>
    </div>
  )
}
