import { ExclamationCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import FundingCycleSection from 'components/Project/FundingCycleSection'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import CurrentFundingCycle from 'packages/v1/components/shared/FundingCycle/CurrentFundingCycle'
import QueuedFundingCycle from 'packages/v1/components/shared/FundingCycle/QueuedFundingCycle'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useV1ConnectedWalletHasPermission } from 'packages/v1/hooks/contractReader/useV1ConnectedWalletHasPermission'
import { V1FundingCycle } from 'packages/v1/models/fundingCycle'
import { V1OperatorPermission } from 'packages/v1/models/permissions'
import { fundingCycleRiskCount } from 'packages/v1/utils/fundingCycle'
import { useContext } from 'react'
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
