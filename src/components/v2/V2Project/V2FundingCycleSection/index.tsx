import { Button, Tooltip } from 'antd'
import { t, Trans } from '@lingui/macro'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import {
  useHasPermission,
  V2OperatorPermission,
} from 'hooks/v2/contractReader/HasPermission'
import { useContext } from 'react'

import { V2FundingCycleRiskCount } from 'utils/v2/fundingCycle'

import FundingCycleSection from 'components/shared/Project/FundingCycleSection'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import CurrentFundingCycle from './CurrentFundingCycle'
import V2ReconfigureFundingModalTrigger from '../V2ProjectReconfigureModal/V2ReconfigureModalTrigger'

export default function V2FundingCycleSection({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { fundingCycle } = useContext(V2ProjectContext)

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
      content: <CurrentFundingCycle showCurrentDetail={showCurrentDetail} />,
    },
  ]

  const canReconfigure = useHasPermission(V2OperatorPermission.RECONFIGURE)

  return (
    <FundingCycleSection
      tabs={tabs}
      reconfigureButton={
        canReconfigure ? (
          <V2ReconfigureFundingModalTrigger
            fundingDuration={fundingCycle?.duration}
            hideProjectDetails
            triggerButton={(onClick: VoidFunction) => (
              <Button size="small" onClick={onClick}>
                <Trans>Reconfigure upcoming</Trans>
              </Button>
            )}
          />
        ) : null
      }
    />
  )
}
