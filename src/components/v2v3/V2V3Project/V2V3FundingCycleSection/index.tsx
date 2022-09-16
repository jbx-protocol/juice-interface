import { SettingOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'

import { ExclamationCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'

import Loading from 'components/Loading'
import {
  getV2V3FundingCycleRiskCount,
  hasFundingDuration,
} from 'utils/v2v3/fundingCycle'
import { serializeV2V3FundingCycleData } from 'utils/v2v3/serializers'

import { CardSection } from 'components/CardSection'
import FundingCycleSection, {
  TabType,
} from 'components/Project/FundingCycleSection'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'

import useProjectQueuedFundingCycle from 'hooks/v2v3/contractReader/ProjectQueuedFundingCycle'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/ProjectUpcomingFundingCycle'
import Link from 'next/link'
import { settingsPagePath } from 'utils/routes'
import CurrentFundingCycle from './CurrentFundingCycle'
import FundingCycleHistory from './FundingCycleHistory/FundingCycleHistory'
import NoFundingCycle from './NoFundingCycle'
import UpcomingFundingCycle from './UpcomingFundingCycle'

export default function V2V3FundingCycleSection({
  expandCard,
}: {
  expandCard?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    fundingCycle,
    fundingCycleMetadata,
    isPreviewMode,
    loading: { fundingCycleLoading },
    handle,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const {
    data: queuedFundingCycleResponse,
    loading: queuedFundingCycleLoading,
  } = useProjectQueuedFundingCycle({
    projectId,
  })
  const [upcomingFundingCycle] = useProjectUpcomingFundingCycle()
  const [queuedFundingCycle] = queuedFundingCycleResponse || []

  if (
    fundingCycleLoading ||
    (queuedFundingCycleLoading && !isPreviewMode) ||
    !fundingCycle ||
    (!queuedFundingCycle && !isPreviewMode)
  ) {
    return <Loading />
  }

  if (fundingCycle.number.eq(0) && queuedFundingCycle?.number.eq(0)) {
    return <NoFundingCycle />
  }

  const tabText = ({
    text,
    hideRiskFlag,
  }: {
    text: string
    hideRiskFlag?: boolean
  }) => {
    const hasRisks =
      fundingCycle &&
      fundingCycleMetadata &&
      getV2V3FundingCycleRiskCount(fundingCycle, fundingCycleMetadata)
    if (!hasRisks || hideRiskFlag) {
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

  const fundingCycleData = serializeV2V3FundingCycleData(fundingCycle)

  const tabs = [
    fundingCycle.number.gt(0) && {
      key: 'current',
      label: tabText({ text: t`Current` }),
      content: <CurrentFundingCycle expandCard={expandCard} />,
    },
    !isPreviewMode &&
      !upcomingFundingCycle?.number.eq(0) && {
        key: 'upcoming',
        label: tabText({ text: t`Upcoming` }),
        content: <UpcomingFundingCycle expandCard={expandCard} />,
      },
    {
      key: 'history',
      label: tabText({ text: t`History`, hideRiskFlag: true }),
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
              <span>
                {hasFundingDuration(fundingCycleData) ? (
                  <Trans>Reconfigure upcoming</Trans>
                ) : (
                  <Trans>Reconfigure</Trans>
                )}
              </span>
            </Button>
          </Link>
        ) : null
      }
    />
  )
}
