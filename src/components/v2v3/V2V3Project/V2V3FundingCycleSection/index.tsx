import { ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import Loading from 'components/Loading'
import FundingCycleSection, {
  TabType,
} from 'components/Project/FundingCycleSection'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/useV2ConnectedWalletHasPermission'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'
import {
  getV2V3FundingCycleRiskCount,
  hasFundingDuration,
} from 'utils/v2v3/fundingCycle'
import { serializeV2V3FundingCycleData } from 'utils/v2v3/serializers'
import { CurrentFundingCycle } from './CurrentFundingCycle'
import { FundingCycleHistory } from './FundingCycleHistory'
import { UpcomingFundingCycle } from './UpcomingFundingCycle'

const TabText = ({
  text,
  hideRiskFlag,
}: {
  text: string
  hideRiskFlag?: boolean
}) => {
  const { fundingCycle, fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const hasRisks =
    fundingCycle &&
    fundingCycleMetadata &&
    getV2V3FundingCycleRiskCount(fundingCycle, fundingCycleMetadata)

  if (!hasRisks || hideRiskFlag) {
    return <span>{text}</span>
  }

  return (
    <Tooltip
      title={
        <Trans>
          This cycle's rules may lead to unexpected behavior. Before paying this
          project, know and understand its rules.
        </Trans>
      }
    >
      <span className="flex items-center gap-1">
        {text}
        <ExclamationCircleOutlined className="ml-1 text-warning-600 dark:text-warning-300" />
      </span>
    </Tooltip>
  )
}

export default function V2V3FundingCycleSection() {
  const {
    fundingCycle,
    handle,
    loading: { fundingCycleLoading },
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const currentCycleHasDuration =
    fundingCycle &&
    hasFundingDuration(serializeV2V3FundingCycleData(fundingCycle))

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )

  if (fundingCycleLoading) {
    return <Loading />
  }

  const reconfigureButtonText = currentCycleHasDuration ? (
    <Trans>Edit upcoming cycle</Trans>
  ) : (
    <Trans>Edit cycle</Trans>
  )

  const tabs = [
    {
      key: 'current',
      label: <TabText text={t`Current`} />,
      content: <CurrentFundingCycle />,
    },
    currentCycleHasDuration && {
      key: 'upcoming',
      label: <TabText text={t`Upcoming`} />,
      content: <UpcomingFundingCycle />,
    },
    {
      key: 'history',
      label: <TabText text={t`History`} hideRiskFlag />,
      content: (
        <CardSection>
          <FundingCycleHistory />
        </CardSection>
      ),
    },
  ].filter(Boolean) as TabType[]

  return (
    <FundingCycleSection
      tabs={tabs}
      reconfigureButton={
        canReconfigure ? (
          <Link
            href={settingsPagePath('cycle', { projectId, handle })}
            legacyBehavior
          >
            <Button size="small" icon={<SettingOutlined />}>
              <span>{reconfigureButtonText}</span>
            </Button>
          </Link>
        ) : null
      }
      hideTitle
    />
  )
}
