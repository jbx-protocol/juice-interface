import { Collapse } from 'antd'
import { Trans } from '@lingui/macro'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { FundingCycle } from 'models/funding-cycle'
import { useContext } from 'react'
import { detailedTimeString } from 'utils/formatTime'
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

  const endTime = fundingCycle.start
    .add(fundingCycle.duration.mul(secsPerDay))
    .mul(1000)

  let headerText = ''
  if (isRecurring(fundingCycle) && fundingCycle.duration.gt(0)) {
    headerText = `${detailedTimeString(endTime)} until #${fundingCycle.number
      .add(1)
      .toString()}`
  } else if (fundingCycle.duration.gt(0)) {
    headerText = detailedTimeString(endTime) + ' left'
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
              {hasFundingTarget(fundingCycle) && fundingCycle.duration.gt(0) ? (
                <span>Cycle #{fundingCycle.number.toString()}</span>
              ) : (
                <span>
                  <Trans>Details</Trans>
                </span>
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
