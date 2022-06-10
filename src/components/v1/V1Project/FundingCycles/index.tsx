import { Tooltip } from 'antd'
import { t, Trans } from '@lingui/macro'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { CardSection } from 'components/shared/CardSection'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import {
  OperatorPermission,
  useHasPermission,
} from 'hooks/v1/contractReader/HasPermission'
import { useContext } from 'react'

import { fundingCycleRiskCount } from 'utils/v1/fundingCycle'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import CurrentFundingCycle from 'components/v1/shared/FundingCycle/CurrentFundingCycle'
import QueuedFundingCycle from 'components/v1/shared/FundingCycle/QueuedFundingCycle'

import FundingCycleSection from 'components/shared/Project/FundingCycleSection'

import FundingHistory from './FundingHistory'
import ReconfigureFundingModalTrigger from './ReconfigureFundingModalTrigger'

export default function FundingCycles({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { projectId, currentFC, queuedFC } = useContext(V1ProjectContext)

  const tabText = ({
    text,
    fundingCycle,
  }: {
    text: string
    fundingCycle: V1FundingCycle | undefined
  }) => {
    const hasRisks = fundingCycle && fundingCycleRiskCount(fundingCycle)
    if (!hasRisks) {
      return text
    }

    return (
      <Tooltip
        title={
          <Trans>
            This funding cycle may pose risks to contributors. Check the funding
            cycle details before paying this project.
          </Trans>
        }
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
    )
  }

  const tabs = [
    {
      key: 'current',
      label: tabText({ text: t`Current`, fundingCycle: currentFC }),
      content: <CurrentFundingCycle showCurrentDetail={showCurrentDetail} />,
    },
    {
      key: 'upcoming',
      label: tabText({ text: t`Upcoming`, fundingCycle: queuedFC }),
      content: <QueuedFundingCycle />,
    },
    {
      key: 'history',
      label: <Trans>History</Trans>,
      content: (
        <CardSection>
          <FundingHistory startId={currentFC?.basedOn} />
        </CardSection>
      ),
    },
  ]

  const canReconfigure = useHasPermission(OperatorPermission.Configure)

  if (!projectId) return null
  return (
    <FundingCycleSection
      tabs={tabs}
      reconfigureButton={
        canReconfigure ? (
          <ReconfigureFundingModalTrigger
            fundingDuration={currentFC?.duration}
          />
        ) : null
      }
    />
  )
}
