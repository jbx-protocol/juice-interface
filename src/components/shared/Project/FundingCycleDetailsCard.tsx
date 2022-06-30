import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Collapse, Tooltip } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { detailedTimeUntil } from 'utils/formatTime'
import { BallotState } from 'models/v2/fundingCycle'

import { Badge, BadgeVariant } from '../Badge'

const COLLAPSE_PANEL_KEY = 'funding-cycle-details'

function BallotStateBadge({ ballotState }: { ballotState: BallotState }) {
  // only show badge for ballot states 0 and 2 (don't show if ballot is 'approved'.)
  const ballotStateVariantMap: { [k in BallotState]?: BadgeVariant } = {
    0: 'warning',
  }

  const ballotStateLabelMap: { [k in BallotState]?: string } = {
    0: 'Pending',
  }

  const ballotStateTooltips: { [k in BallotState]?: string } = {
    0: t`This proposed funding cycle reconfiguration has an active ballot and isn't yet approved.`,
  }

  const ballotStateIcons: { [k in BallotState]?: JSX.Element } = {
    0: <ClockCircleOutlined />,
  }

  const variant = ballotStateVariantMap[ballotState]

  if (!variant) return null

  return (
    <Badge
      variant={variant}
      style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}
    >
      <Tooltip title={ballotStateTooltips[ballotState]}>
        {ballotStateIcons[ballotState]} {ballotStateLabelMap[ballotState]}
      </Tooltip>
    </Badge>
  )
}

export default function FundingCycleDetailsCard({
  fundingCycleNumber,
  fundingCycleStartTime,
  fundingCycleDurationSeconds,
  fundingCycleRiskCount,
  isFundingCycleRecurring,
  fundingCycleDetails,
  expand,
  isPreviewMode,
  ballotState,
}: {
  fundingCycleNumber: BigNumber
  fundingCycleStartTime: BigNumber
  fundingCycleDurationSeconds: BigNumber
  fundingCycleRiskCount: number
  fundingCycleDetails: JSX.Element
  isFundingCycleRecurring: boolean
  expand?: boolean
  isPreviewMode?: boolean
  ballotState?: BallotState
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const HeaderText = () => {
    if (ballotState !== undefined) {
      return <BallotStateBadge ballotState={ballotState} />
    }

    if (!fundingCycleDurationSeconds.gt(0)) return null

    const endTimeSeconds = fundingCycleStartTime.add(
      fundingCycleDurationSeconds,
    )
    const formattedTimeLeft = !isPreviewMode
      ? detailedTimeUntil(endTimeSeconds)
      : detailedTimeUntil(fundingCycleDurationSeconds)

    return (
      <span style={{ color: colors.text.secondary, marginLeft: 10 }}>
        {isFundingCycleRecurring ? (
          <Trans>
            {formattedTimeLeft} until #{fundingCycleNumber.add(1).toString()}
          </Trans>
        ) : (
          <Trans>{formattedTimeLeft} left</Trans>
        )}
      </span>
    )
  }

  return (
    <Collapse
      style={{
        background: 'transparent',
        border: 'none',
      }}
      className="minimal"
      defaultActiveKey={expand ? COLLAPSE_PANEL_KEY : undefined}
    >
      <CollapsePanel
        key={COLLAPSE_PANEL_KEY}
        style={{ border: 'none' }}
        header={
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <span>
                {fundingCycleDurationSeconds.gt(0) ? (
                  <Trans>Cycle #{fundingCycleNumber.toString()}</Trans>
                ) : (
                  <Trans>Details</Trans>
                )}
              </span>

              {fundingCycleRiskCount > 0 && (
                <span style={{ marginLeft: 10, color: colors.text.secondary }}>
                  <Tooltip
                    title={
                      <Trans>
                        Some funding cycle properties may indicate risk for
                        project contributors.
                      </Trans>
                    }
                  >
                    <ExclamationCircleOutlined style={{ marginRight: 6 }} />
                    {fundingCycleRiskCount}
                  </Tooltip>
                </span>
              )}
            </div>

            <HeaderText />
          </div>
        }
      >
        {fundingCycleDetails}
      </CollapsePanel>
    </Collapse>
  )
}
