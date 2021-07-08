import { Collapse, Space } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { FundingCycle } from 'models/funding-cycle'
import { PaymentMod, TicketMod } from 'models/mods'
import { useContext } from 'react'
import { detailedTimeString } from 'utils/formatTime'
import { hasFundingTarget, isRecurring } from 'utils/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'
import PaymentModsList from './PaymentModsList'
import TicketModsList from './TicketModsList'

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
  paymentMods: PaymentMod[] | undefined
  ticketMods: TicketMod[] | undefined
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
      {hasFundingTarget(fundingCycle) && (
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
          </CollapsePanel>
        </Collapse>
      )}

      <Space direction="vertical" size="middle">
        <div>
          <h4 style={{ color: colors.text.secondary, fontWeight: 600 }}>
            Spending:
          </h4>
          <PaymentModsList
            mods={paymentMods}
            fundingCycle={fundingCycle}
            projectId={projectId}
            isOwner={isOwner}
          />
        </div>

        <div>
          <h4 style={{ color: colors.text.secondary, fontWeight: 600 }}>
            Allocated token reserves:
          </h4>
          <TicketModsList
            mods={ticketMods}
            fundingCycle={fundingCycle}
            projectId={projectId}
            isOwner={isOwner}
          />
        </div>
      </Space>
    </div>
  )
}
