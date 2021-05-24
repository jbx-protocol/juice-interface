import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { FundingCycle } from 'models/funding-cycle'
import { useContext } from 'react'
import { detailedTimeString } from 'utils/formatTime'
import { isRecurring } from 'utils/fundingCycle'

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

  const now = Math.round(new Date().valueOf() / 1000)
  const secondsLeft = fundingCycle.start + fundingCycle.duration - now
  const isEnded = secondsLeft <= 0

  let headerText: string

  if (isRecurring(fundingCycle)) {
    headerText = isEnded
      ? `ended`
      : `ends in ${detailedTimeString(secondsLeft)}`
  } else headerText = detailedTimeString(secondsLeft) + ' left'

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
                justifyContent: 'space-between',
                cursor: 'pointer',
                color: colors.text.secondary,
              }}
            >
              <span>Funding cycle #{fundingCycle.number.toString()}</span>
              {headerText}
            </div>
          }
        >
          <FundingCycleDetails fundingCycle={fundingCycle} />
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
