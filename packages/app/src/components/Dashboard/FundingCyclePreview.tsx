import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { FundingCycle } from 'models/funding-cycle'
import { ModRef } from 'models/mods'
import { useContext } from 'react'
import { detailedTimeString } from 'utils/formatTime'
import { isRecurring } from 'utils/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'
import Mods from './Mods'

export default function FundingCyclePreview({
  projectId,
  fundingCycle,
  paymentMods,
  showDetail,
  isOwner,
}: {
  projectId: BigNumber | undefined
  fundingCycle: FundingCycle | undefined
  paymentMods: ModRef[] | undefined
  showDetail?: boolean
  isOwner?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!fundingCycle) return null

  const now = Math.round(new Date().valueOf() / 1000)
  const secondsLeft = fundingCycle.start.add(fundingCycle.duration).sub(now)
  const isEnded = secondsLeft.lte(0)

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
                width: '100%',
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
          <h4 style={{ color: colors.text.secondary, fontWeight: 600 }}>
            Auto payouts:
          </h4>
          <Mods
            mods={paymentMods}
            fundingCycle={fundingCycle}
            projectId={projectId}
            isOwner={isOwner}
          />
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
