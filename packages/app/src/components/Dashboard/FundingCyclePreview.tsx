import { Collapse, Space } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext } from 'react'
import { fromPerbicent } from 'utils/formatNumber'
import { detailedTimeString } from 'utils/formatTime'
import { decodeFCMetadata, hasFundingTarget, isRecurring } from 'utils/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'
import PayoutModsList from './PayoutModsList'
import TicketModsList from './TicketModsList'

export default function FundingCyclePreview({
  projectId,
  fundingCycle,
  payoutMods,
  ticketMods,
  showDetail,
  isOwner,
}: {
  projectId: BigNumber | undefined
  fundingCycle: FundingCycle | undefined
  payoutMods: PayoutMod[] | undefined
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

  let headerText = ''

  if (hasFundingTarget(fundingCycle)) {
    if (isRecurring(fundingCycle)) {
      headerText = isEnded ? `ended` : `ends in ${detailedTimeString(daysLeft)}`
    } else headerText = detailedTimeString(daysLeft) + ' left'
  }

  const metadata = decodeFCMetadata(fundingCycle.metadata)

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <h4 style={{ color: colors.text.secondary, fontWeight: 600 }}>
            <TooltipLabel
              label="Spending:"
              tip="Any time a withdrawal is made, a percentage of the withdrawal amount will be automatically paid to each payout destination."
            />
          </h4>
          <PayoutModsList
            mods={payoutMods}
            fundingCycle={fundingCycle}
            projectId={projectId}
            isOwner={isOwner}
          />
        </div>

        <div>
          <h4 style={{ color: colors.text.secondary, fontWeight: 600 }}>
            <TooltipLabel
              label={`Reserved tokens (${fromPerbicent(metadata?.reservedRate)}%):`}
              tip="Reserved tokens accumulate as a project is paid, based on a percentage set by the project owner. When reserved tokens are minted, a percentage of them will be distributed to each destination wallet here, with the rest going to the project owner."
            />
          </h4>
          <TicketModsList
            mods={ticketMods}
            fundingCycle={fundingCycle}
            projectId={projectId}
            isOwner={isOwner}
          />
        </div>

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
                {hasFundingTarget(fundingCycle) ? (
                  <span>Funding cycle #{fundingCycle.number.toString()}</span>
                ) : (
                  <span>Details</span>
                )}
                {headerText}
              </div>
            }
          >
            <FundingCycleDetails fundingCycle={fundingCycle} />
          </CollapsePanel>
        </Collapse>
      </Space>
    </div>
  )
}
