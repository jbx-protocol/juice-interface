import { Descriptions } from 'antd'
import { FundingCycle } from 'models/funding-cycle'
import { fromPerMille } from 'utils/formatCurrency'
import { formatDate } from 'utils/formatDate'

import { decodeFCMetadata } from '../../utils/fundingCycle'
import TooltipLabel from '../shared/TooltipLabel'

export default function FundingCycleDetails({
  fundingCycle,
}: {
  fundingCycle: FundingCycle | undefined
}) {
  if (!fundingCycle) return null

  const formattedStartTime = formatDate(fundingCycle.start * 1000)

  const formattedEndTime = formatDate(
    fundingCycle.start + fundingCycle.duration * 1000,
  )

  const metadata = decodeFCMetadata(fundingCycle.metadata)

  return (
    <Descriptions labelStyle={{ fontWeight: 600 }} size="small" column={2}>
      <Descriptions.Item label="Start">{formattedStartTime}</Descriptions.Item>

      <Descriptions.Item label="End">{formattedEndTime}</Descriptions.Item>

      <Descriptions.Item
        label={
          <TooltipLabel
            label="Reserved"
            tip="This project's owner can mint Tickets for themselves to share in the overflow with all contributors. For example, if this is set to 5% and 95 tickets were given out over the course of this budget, then the owner will be able to mint 5 Tickets for themselves once the budget expires."
          />
        }
      >
        {fromPerMille(metadata?.reserved)}%
      </Descriptions.Item>

      <Descriptions.Item
        label={
          <TooltipLabel
            label="Discount rate"
            tip="The rate at which payments to future
            budgeting time frames are valued compared to payments to the current one. For example, if this is set to 97%, then someone who pays 100 towards the next budgeting time frame will only receive 97% the amount of Tickets received by someone who paid 100 towards this budgeting time frame."
          />
        }
      >
        {fromPerMille(fundingCycle.discountRate)} %
      </Descriptions.Item>

      <Descriptions.Item label="Term">
        {fundingCycle.number.toString()}
      </Descriptions.Item>

      <Descriptions.Item
        label={
          <TooltipLabel
            label="Bonding curve"
            tip="This rate determines the amount of overflow that each Ticket can be redeemed for at any given time. 
              Redeeming a ticket on a lower bonding curve reduces its immediate value, while increasing the redeem value
              of each remaining ticket. This creates an incentive to hodl tickets and not redeem them earlier 
              than others. A bonding curve of 100% means all tickets will have the same value regardless
              of when they are redeemed."
          />
        }
      >
        {fromPerMille(metadata?.bondingCurveRate)}%
      </Descriptions.Item>
    </Descriptions>
  )
}
