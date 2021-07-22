import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { FundingCycle } from 'models/funding-cycle'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { hasFundingTarget, isRecurring } from 'utils/fundingCycle'

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

  const today = Math.floor(new Date().valueOf() / 1000 / secsPerDay)
  const daysLeft = fundingCycle.start
    .div(secsPerDay)
    .add(fundingCycle.duration)
    .sub(today)
  const isEnded = daysLeft.lte(0)

  let headerText = ''

  const formattedEndTime = formatDate(
    fundingCycle.start.add(fundingCycle.duration.mul(secsPerDay)).mul(1000),
  )

  if (hasFundingTarget(fundingCycle)) {
    if (isRecurring(fundingCycle)) {
      headerText = isEnded
        ? `#${fundingCycle.number.add(1).toString()} starts ${formattedEndTime}`
        : `${daysLeft} day until #${fundingCycle.number.add(1).toString()}`
    } else headerText = daysLeft + 'd left'
  }

  return (
    <div>
      <Collapse
        style={{
          background: 'transparent',
          border: 'none',
          margin: 0,
          padding: 0,
        }}
        className="minimal"
        defaultActiveKey={showDetail ? '0' : undefined}
      >
        <CollapsePanel
          key={'0'}
          style={{ border: 'none', padding: 0 }}
          header={
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              {hasFundingTarget(fundingCycle) ? (
                <span>Funding cycle #{fundingCycle.number.toString()}</span>
              ) : (
                <span>Details</span>
              )}
              <span style={{ color: colors.text.secondary }}>{headerText}</span>
            </div>
          }
        >
          <FundingCycleDetails fundingCycle={fundingCycle} />
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
