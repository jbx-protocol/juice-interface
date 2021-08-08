import { Button, Space } from 'antd'
import ReconfigureBudgetModal from 'components/modals/ReconfigureBudgetModal'
import { CardSection } from 'components/shared/CardSection'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeOption } from 'constants/theme/theme-option'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

import CurrentFundingCycle from './CurrentFundingCycle'
import FundingHistory from './FundingHistory'
import QueuedFundingCycle from './QueuedFundingCycle'

type TabOption = 'current' | 'upcoming' | 'history'

export default function FundingCycles({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const [selectedTab, setSelectedTab] = useState<TabOption>('current')
  const [reconfigureModalVisible, setReconfigureModalVisible] = useState<
    boolean
  >(false)
  const [hoverTab, setHoverTab] = useState<TabOption>()

  const { projectId, currentFC, isOwner, queuedFC } = useContext(ProjectContext)

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
      tabContent = <CurrentFundingCycle showCurrentDetail={showCurrentDetail} />
      break
    case 'upcoming':
      tabContent = <QueuedFundingCycle />
      break
    case 'history':
      tabContent = (
        <CardSection padded>
          <FundingHistory startId={currentFC?.basedOn} />
        </CardSection>
      )
      break
  }

  if (!projectId) return null

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
          tip="A project's lifetime is defined in funding cycles. If a funding target is set, the project can withdraw no more than the target for the duration of the cycle."
        />
        <Space style={{ fontSize: '.8rem' }} size="middle">
          {tab('current')}
          {currentFC?.duration.gt(0) ? tab('upcoming') : null}
          {tab('history')}
        </Space>
      </div>
      <div>{tabContent}</div>

      {isOwner && (
        <Button
          style={{ marginTop: 20 }}
          onClick={() => setReconfigureModalVisible(true)}
          size="small"
        >
          Edit funding cycle
        </Button>
      )}

      <ReconfigureBudgetModal
        visible={reconfigureModalVisible}
        onDone={() => setReconfigureModalVisible(false)}
        fundingCycle={queuedFC?.number.gt(0) ? queuedFC : currentFC}
        projectId={projectId}
      />
    </div>
  )
}
