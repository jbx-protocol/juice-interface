import { ExclamationCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Collapse, Tooltip } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { FundingCycle } from 'models/funding-cycle'
import { useContext } from 'react'
import { detailedTimeString } from 'utils/formatTime'
import { fundingCycleRiskCount, isRecurring } from 'utils/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'

export default function FundingCyclePreview({
  fundingCycle,
  showDetail,
}: {
  fundingCycle: FundingCycle | undefined
  showDetail?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!fundingCycle) return null

  const secsPerDay = 60 * 60 * 24

  const endTime = fundingCycle.start
    .add(fundingCycle.duration.mul(secsPerDay))
    .mul(1000)

  let headerText = ''
  if (isRecurring(fundingCycle) && fundingCycle.duration.gt(0)) {
    headerText = t`${detailedTimeString(endTime)} until #${fundingCycle.number
      .add(1)
      .toString()}`
  } else if (fundingCycle.duration.gt(0)) {
    headerText = t`${detailedTimeString(endTime)} left`
  }

  return (
    <div>
      <Collapse
        style={{
          background: 'transparent',
          border: 'none',
        }}
        className="minimal"
        defaultActiveKey={showDetail ? '0' : undefined}
      >
        <CollapsePanel
          key={'0'}
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
              <span>
                {fundingCycle.duration.gt(0) ? (
                  <span>
                    <Trans>Cycle #{fundingCycle.number.toString()}</Trans>
                  </span>
                ) : (
                  <span>
                    <Trans>Details</Trans>
                  </span>
                )}
                {fundingCycleRiskCount(fundingCycle) > 0 && (
                  <span
                    style={{ marginLeft: 10, color: colors.text.secondary }}
                  >
                    <Tooltip
                      title={t`Some funding cycle properties may indicate risk
                    for project contributors.`}
                    >
                      <ExclamationCircleOutlined style={{ marginRight: 2 }} />
                      {fundingCycleRiskCount(fundingCycle)}
                    </Tooltip>
                  </span>
                )}
              </span>
              <span style={{ color: colors.text.secondary }}>
                {headerText.length > 0 && (
                  <span style={{ marginLeft: 10 }}>{headerText}</span>
                )}
              </span>
            </div>
          }
        >
          <FundingCycleDetails fundingCycle={fundingCycle} />
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
