import { ExclamationCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import FundingCycleSection from 'components/Project/FundingCycleSection'
import CurrentFundingCycle from 'components/v1/shared/FundingCycle/CurrentFundingCycle'
import QueuedFundingCycle from 'components/v1/shared/FundingCycle/QueuedFundingCycle'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/useV1ConnectedWalletHasPermission'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext } from 'react'
import { fundingCycleRiskCount } from 'utils/v1/fundingCycle'
import FundingHistory from './FundingHistory'
import ReconfigureFundingModalTrigger from './ReconfigureFundingModalTrigger'

export default function FundingCycles() {
  const { currentFC, queuedFC } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

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
            This cycle's rules may lead to unexpected behavior. Before paying
            this project, know and understand its rules.
          </Trans>
        }
      >
        <span>
          {text}
          <ExclamationCircleOutlined className="ml-1 text-warning-600 dark:text-warning-300" />
        </span>
      </Tooltip>
    )
  }

  const tabs = [
    {
      key: 'current',
      label: tabText({ text: t`Current`, fundingCycle: currentFC }),
      content: <CurrentFundingCycle />,
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

  const canReconfigure = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.Configure,
  )

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
