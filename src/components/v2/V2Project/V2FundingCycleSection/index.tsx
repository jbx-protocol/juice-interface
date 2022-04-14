import { Button, Tooltip } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

import { t, Trans } from '@lingui/macro'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import {
  useHasPermission,
  V2OperatorPermission,
} from 'hooks/v2/contractReader/HasPermission'
import { useContext } from 'react'

import { V2FundingCycleRiskCount } from 'utils/v2/fundingCycle'

import FundingCycleSection, {
  TabType,
} from 'components/shared/Project/FundingCycleSection'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import CurrentFundingCycle from './CurrentFundingCycle'
import V2ReconfigureFundingModalTrigger from '../V2ProjectReconfigureModal/V2ReconfigureModalTrigger'
import UpcomingFundingCycle from './UpcomingFundingCycle'

export default function V2FundingCycleSection({
  expandCard,
}: {
  expandCard?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { fundingCycle, isPreviewMode } = useContext(V2ProjectContext)

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

  const tabs = [
    {
      key: 'current',
      label: tabText({ text: t`Current` }),
      content: <CurrentFundingCycle expandCard={expandCard} />,
    },
    !isPreviewMode && {
      key: 'upcoming',
      label: tabText({ text: t`Upcoming` }),
      content: <UpcomingFundingCycle expandCard={expandCard} />,
    },
  ].filter(Boolean) as TabType[]

  const canReconfigure = useHasPermission(V2OperatorPermission.RECONFIGURE)
  const showReconfigureButton = canReconfigure && !isPreviewMode

  return (
    <FundingCycleSection
      tabs={tabs}
      reconfigureButton={
        showReconfigureButton ? (
          <V2ReconfigureFundingModalTrigger
            hideProjectDetails
            triggerButton={(onClick: VoidFunction) => (
              <Button size="small" onClick={onClick} icon={<SettingOutlined />}>
                <span>
                  <Trans>Reconfigure upcoming</Trans>
                </span>
              </Button>
            )}
          />
        ) : null
      }
    />
  )
}
