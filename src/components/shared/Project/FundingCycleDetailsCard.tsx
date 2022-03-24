import { ExclamationCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Collapse, Tooltip } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { detailedTimeString } from 'utils/formatTime'

const COLLAPSE_PANEL_KEY = 'funding-cycle-details'
const daySeconds = 60 * 60 * 24

export default function FundingCycleDetailsCard({
  fundingCycleNumber,
  fundingCycleStartTime,
  fundingCycleDuration,
  fundingCycleRiskCount,
  isFundingCycleRecurring,
  fundingCycleDetails,
  showDetail,
}: {
  fundingCycleNumber: BigNumber
  fundingCycleStartTime: BigNumber
  fundingCycleDuration: BigNumber
  fundingCycleRiskCount: number
  fundingCycleDetails: JSX.Element
  isFundingCycleRecurring: boolean
  showDetail?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const endTimeMilliseconds = fundingCycleStartTime
    .add(fundingCycleDuration.mul(daySeconds))
    .mul(1000)

  let headerText = ''
  if (isFundingCycleRecurring && fundingCycleDuration.gt(0)) {
    headerText = t`${detailedTimeString(
      endTimeMilliseconds,
    )} until #${fundingCycleNumber.add(1).toString()}`
  } else if (fundingCycleDuration.gt(0)) {
    headerText = t`${detailedTimeString(endTimeMilliseconds)} left`
  }

  return (
    <div>
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
                  {fundingCycleDuration.gt(0) ? (
                    <Trans>Cycle #{fundingCycleNumber.toString()}</Trans>
                  ) : (
                    <Trans>Details</Trans>
                  )}
                </span>

                {fundingCycleRiskCount > 0 && (
                  <span
                    style={{ marginLeft: 10, color: colors.text.secondary }}
                  >
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

              {headerText.length > 0 && (
                <span style={{ color: colors.text.secondary, marginLeft: 10 }}>
                  {headerText}
                </span>
              )}
            </div>
          }
        >
          {fundingCycleDetails}
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
