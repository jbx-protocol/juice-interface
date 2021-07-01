import { Collapse, Space } from 'antd'
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
  ticketMods,
  showDetail,
  isOwner,
}: {
  projectId: BigNumber | undefined
  fundingCycle: FundingCycle | undefined
  paymentMods: ModRef[] | undefined
  ticketMods: ModRef[] | undefined
  showDetail?: boolean
  isOwner?: boolean
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

  let headerText: string

  if (isRecurring(fundingCycle)) {
    headerText = isEnded ? `ended` : `ends in ${detailedTimeString(daysLeft)}`
  } else headerText = detailedTimeString(daysLeft) + ' left'

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
          <Space style={{ width: '100%' }} direction="vertical" size="large">
            <FundingCycleDetails fundingCycle={fundingCycle} />

            <div>
              <h4 style={{ color: colors.text.secondary, fontWeight: 600 }}>
                Auto payouts:
              </h4>
              <Mods
                mods={paymentMods}
                fundingCycle={fundingCycle}
                projectId={projectId}
                isOwner={isOwner}
                emptyText="No payouts set"
                editButtonText="Edit payouts"
              />
            </div>

            <div>
              <h4 style={{ color: colors.text.secondary, fontWeight: 600 }}>
                Allocated token reserves:
              </h4>
              <Mods
                mods={ticketMods}
                fundingCycle={fundingCycle}
                projectId={projectId}
                isOwner={isOwner}
                emptyText="No destinations set"
                editButtonText="Allocate token reserves"
              />
            </div>
          </Space>
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
