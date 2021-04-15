import { Descriptions } from 'antd'
import { FundingCycle } from 'models/funding-cycle'
import { fromPerMille } from 'utils/formatCurrency'
import { formatDate } from 'utils/formatDate'

import TooltipLabel from '../shared/TooltipLabel'

export default function FundingCycleDetails({
  fundingCycle,
}: {
  fundingCycle: FundingCycle | undefined
}) {
  if (!fundingCycle) return null

  const formattedStartTime = formatDate(fundingCycle.start.mul(1000).toNumber())

  const formattedEndTime = formatDate(
    fundingCycle.start.add(fundingCycle.duration).mul(1000).toNumber(),
  )

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
        {fromPerMille(fundingCycle.reserved)}%
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

      {fundingCycle.bondingCurveRate.gt(0) ? (
        <Descriptions.Item label="Bonding curve rate">
          {fromPerMille(fundingCycle.bondingCurveRate)}%
        </Descriptions.Item>
      ) : null}
    </Descriptions>
  )
}
