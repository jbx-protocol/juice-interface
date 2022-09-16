import { ExclamationCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Collapse, Tooltip } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { BallotState } from 'models/v2/fundingCycle'
import { useContext } from 'react'
import { formatDateToUTC } from 'utils/format/formatDate'
import { detailedTimeUntil } from 'utils/format/formatTime'

import { BallotStateBadge } from './BallotStateBadge'

const COLLAPSE_PANEL_KEY = 'funding-cycle-details'

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
  ballotStrategyAddress,
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
  ballotStrategyAddress?: string
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const HeaderText = () => {
    if (ballotState !== undefined) {
      return (
        <BallotStateBadge
          ballotState={ballotState}
          ballotStrategyAddress={ballotStrategyAddress}
        />
      )
    }

    if (!fundingCycleDurationSeconds.gt(0)) return null

    const endTimeSeconds = fundingCycleStartTime.add(
      fundingCycleDurationSeconds,
    )
    const formattedTimeLeft = !isPreviewMode
      ? detailedTimeUntil(endTimeSeconds)
      : detailedTimeUntil(fundingCycleDurationSeconds)

    const fundingCycleDurationMilliseconds = endTimeSeconds.mul(1000).toNumber()

    return (
      <Tooltip title={`${formatDateToUTC(fundingCycleDurationMilliseconds)}`}>
        <span style={{ color: colors.text.secondary, marginLeft: 10 }}>
          {isFundingCycleRecurring ? (
            <Trans>
              {formattedTimeLeft} until #{fundingCycleNumber.add(1).toString()}
            </Trans>
          ) : (
            <Trans>{formattedTimeLeft} left</Trans>
          )}
        </span>
      </Tooltip>
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
              {fundingCycleDurationSeconds.gt(0) ||
              (fundingCycleDurationSeconds.eq(0) &&
                fundingCycleNumber.gt(0)) ? (
                <Trans>Cycle #{fundingCycleNumber.toString()}</Trans>
              ) : (
                <Trans>Details</Trans>
              )}

              {fundingCycleRiskCount > 0 && (
                <span style={{ marginLeft: 10, color: colors.text.secondary }}>
                  <Tooltip
                    title={
                      <Trans>
                        Some funding cycle settings may put project contributors
                        at risk.
                      </Trans>
                    }
                  >
                    <ExclamationCircleOutlined />
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
