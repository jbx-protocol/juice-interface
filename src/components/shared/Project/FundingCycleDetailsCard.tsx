import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Collapse, Tooltip } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { detailedTimeUntil } from 'utils/formatTime'

const COLLAPSE_PANEL_KEY = 'funding-cycle-details'

export default function FundingCycleDetailsCard({
  fundingCycleNumber,
  fundingCycleStartTime,
  fundingCycleDurationSeconds,
  fundingCycleRiskCount,
  isFundingCycleRecurring,
  fundingCycleDetails,
  showDetail,
}: {
  fundingCycleNumber: BigNumber
  fundingCycleStartTime: BigNumber
  fundingCycleDurationSeconds: BigNumber
  fundingCycleRiskCount: number
  fundingCycleDetails: JSX.Element
  isFundingCycleRecurring: boolean
  showDetail?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const HeaderText = () => {
    if (!fundingCycleDurationSeconds.gt(0)) return null

    const endTimeSeconds = fundingCycleStartTime.add(
      fundingCycleDurationSeconds,
    )
    const formattedTimeLeft = detailedTimeUntil(endTimeSeconds)

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
      defaultActiveKey={showDetail ? COLLAPSE_PANEL_KEY : undefined}
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
                    <ExclamationCircleOutlined style={{ marginRight: 2 }} />
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
