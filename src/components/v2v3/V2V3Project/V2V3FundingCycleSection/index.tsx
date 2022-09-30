import { ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import Loading from 'components/Loading'
import FundingCycleSection, {
  TabType,
} from 'components/Project/FundingCycleSection'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2v3/permissions'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
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

export function V2V3FundingCycleSection() {
  const {
    fundingCycle,
    isPreviewMode,
    handle,
    loading: { fundingCycleLoading },
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  if (fundingCycleLoading) {
    return <Loading />
  }

  const reconfigureButtonText =
    fundingCycle &&
    hasFundingDuration(serializeV2V3FundingCycleData(fundingCycle)) ? (
      <Trans>Reconfigure upcoming</Trans>
    ) : (
      <Trans>Reconfigure</Trans>
    )

  const tabs = [
    {
      key: 'current',
      label: <TabText text={t`Current`} />,
      content: <CurrentFundingCycle />,
    },
    !isPreviewMode && {
      key: 'upcoming',
      label: <TabText text={t`Upcoming`} />,
      content: <UpcomingFundingCycle />,
    },
    !isPreviewMode && {
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
          <Link href={settingsPagePath('reconfigurefc', { projectId, handle })}>
            <Button size="small" icon={<SettingOutlined />}>
              <span>{reconfigureButtonText}</span>
            </Button>
          </Link>
        ) : null
      }
    />
  )
}
