import { ExclamationCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import FundingCycleSection from 'components/Project/FundingCycleSection'
import CurrentFundingCycle from 'components/v1/shared/FundingCycle/CurrentFundingCycle'
import QueuedFundingCycle from 'components/v1/shared/FundingCycle/QueuedFundingCycle'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
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
            This funding cycle may pose risks to contributors. Check the funding
            cycle details before paying this project.
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
