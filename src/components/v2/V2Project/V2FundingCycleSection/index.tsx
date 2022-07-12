import { Button, Tooltip } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

import { t, Trans } from '@lingui/macro'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'
import { useContext } from 'react'

import {
  hasFundingDuration,
  V2FundingCycleRiskCount,
} from 'utils/v2/fundingCycle'
import { serializeV2FundingCycleData } from 'utils/v2/serializers'
import Loading from 'components/Loading'

import FundingCycleSection, {
  TabType,
} from 'components/Project/FundingCycleSection'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { CardSection } from 'components/CardSection'

import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'

import CurrentFundingCycle from './CurrentFundingCycle'
import V2ReconfigureFundingModalTrigger from '../V2ProjectReconfigureModal/V2ReconfigureModalTrigger'
import UpcomingFundingCycle from './UpcomingFundingCycle'
import FundingCycleHistory from './FundingCycleHistory'
import NoFundingCycle from './NoFundingCycle'

export default function V2FundingCycleSection({
  expandCard,
}: {
  expandCard?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    fundingCycle,
    isPreviewMode,
    loading: { fundingCycleLoading },
    projectId,
  } = useContext(V2ProjectContext)

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const {
    data: queuedFundingCycleResponse,
    loading: queuedFundingCycleLoading,
  } = useProjectQueuedFundingCycle({
    projectId,
  })

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

  const tabText = ({ text }: { text: string }) => {
    const hasRisks = fundingCycle && V2FundingCycleRiskCount(fundingCycle)
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

  const fundingCycleData = serializeV2FundingCycleData(fundingCycle)

  const tabs = [
    fundingCycle.number.gt(0) && {
      key: 'current',
      label: tabText({ text: t`Current` }),
      content: <CurrentFundingCycle expandCard={expandCard} />,
    },
    !isPreviewMode &&
      (hasFundingDuration(fundingCycleData) || fundingCycle.number.eq(0)) && {
        key: 'upcoming',
        label: tabText({ text: t`Upcoming` }),
        content: <UpcomingFundingCycle expandCard={expandCard} />,
      },
    {
      key: 'history',
      label: tabText({ text: t`History` }),
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
          <V2ReconfigureFundingModalTrigger
            hideProjectDetails
            triggerButton={(onClick: VoidFunction) => (
              <Button size="small" onClick={onClick} icon={<SettingOutlined />}>
                <span>
                  {hasFundingDuration(fundingCycleData) ? (
                    <Trans>Reconfigure upcoming</Trans>
                  ) : (
                    <Trans>Reconfigure</Trans>
                  )}
                </span>
              </Button>
            )}
          />
        ) : null
      }
    />
  )
}
