import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { FundingCycle } from 'models/funding-cycle'
import { detailedTimeString } from 'utils/formatTime'

import FundingCycleDetails from './FundingCycleDetails'

export default function FundingCyclePreview({
  fundingCycle,
  showDetail,
}: {
  fundingCycle: FundingCycle | undefined
  showDetail?: boolean
}) {
  if (!fundingCycle) return null

  const isRecurring = fundingCycle.discountRate > 0

  const now = Math.round(new Date().valueOf() / 1000)
  const secondsLeft = fundingCycle.start + fundingCycle.duration - now
  const isEnded = secondsLeft <= 0

  let header: string

  if (isRecurring) {
    header = isEnded
      ? 'Funding cycle ended'
      : 'Funding cycle ends in ' + detailedTimeString(secondsLeft)
  } else header = detailedTimeString(secondsLeft) + ' left'

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
          header={header}
        >
          <FundingCycleDetails fundingCycle={fundingCycle} />
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
