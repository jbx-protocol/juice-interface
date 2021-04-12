import { Descriptions } from 'antd'
import { Budget } from 'models/budget'
import React from 'react'
import { fromPerMille } from 'utils/formatCurrency'
import { formatDate } from 'utils/formatDate'

import TooltipLabel from '../shared/TooltipLabel'

export default function TermDetails({
  budget,
}: {
  budget: Budget | undefined
}) {
  if (!budget) return null

  const formattedStartTime = formatDate(budget.start.mul(1000).toNumber())

  const formattedEndTime = formatDate(
    budget.start.add(budget.duration).mul(1000).toNumber(),
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
        {fromPerMille(budget.reserved)}%
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
        {fromPerMille(budget.discountRate)} %
      </Descriptions.Item>

      <Descriptions.Item label="Term">
        {budget.number.toString()}
      </Descriptions.Item>

      {budget.bondingCurveRate.gt(0) ? (
        <Descriptions.Item label="Bonding curve rate">
          {fromPerMille(budget.bondingCurveRate)}%
        </Descriptions.Item>
      ) : null}
    </Descriptions>
  )
}
