import { BigNumber } from '@ethersproject/bignumber'
import { Collapse, Descriptions } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { colors } from 'constants/styles/colors'
import { Budget } from 'models/budget'
import moment from 'moment'
import React from 'react'
import { budgetCurrencySymbol } from 'utils/budgetCurrency'
import { formatWad, fromPerMille } from 'utils/formatCurrency'
import { detailedTimeString } from 'utils/formatTime'

import TooltipLabel from '../shared/TooltipLabel'
import { secsToDays } from '../../utils/formatTime'

export default function TermDetails({
  budget,
  showDetail,
}: {
  budget: Budget | undefined
  showDetail?: boolean
}) {
  if (!budget) return null

  const formatDate = (dateMillis: number) =>
    moment(dateMillis).format('M-DD-YYYY h:mma')

  const formattedStartTime = formatDate(budget.start.mul(1000).toNumber())

  const formattedEndTime = formatDate(
    budget.start
      .add(budget.duration)
      .mul(1000)
      .toNumber(),
  )

  const isRecurring = budget?.discountRate.gt(0)

  const now = BigNumber.from(Math.round(new Date().valueOf() / 1000))
  const secondsLeft = budget.start.add(budget.duration).sub(now)
  const isEnded = secondsLeft.lte(0)

  return (
    <Collapse
      style={{
        background: 'transparent',
        border: 'none',
        margin: 0,
        padding: 0,
      }}
      className="minimal"
      defaultActiveKey={showDetail ? '0' : undefined}
      accordion
    >
      <CollapsePanel
        key={'0'}
        style={{ border: 'none', padding: 0 }}
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Withdraw limit:</span>
            <span>
              {budgetCurrencySymbol(budget.currency)}
              {formatWad(budget.target)} / {secsToDays(budget.duration)} days
            </span>
          </div>
        }
      >
        <Descriptions labelStyle={{ fontWeight: 600 }} size="small" column={2}>
          <Descriptions.Item label="Time left">
            {isRecurring && !isEnded ? detailedTimeString(secondsLeft) : '--'}
          </Descriptions.Item>

          <Descriptions.Item label="Term">
            {budget.number.toString()}
          </Descriptions.Item>

          <Descriptions.Item label="Start">
            {formattedStartTime}
          </Descriptions.Item>

          <Descriptions.Item label="End">{formattedEndTime}</Descriptions.Item>

          <Descriptions.Item
            label={
              <TooltipLabel
                label="Discount rate"
                tip="The rate at which payments to future
            budgeting time frames are valued compared to payments to the current one. For example, if this is set to 97%, then someone who pays 100 towards the next budgeting time frame will only receive 97% the amount of tickets received by someone who paid 100 towards this budgeting time frame."
              />
            }
          >
            {fromPerMille(budget.discountRate)} %
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <TooltipLabel
                label="Reserved"
                tip="This project's owner can mint tickets for themselves to share in the overflow with all contributors. For example, if this is set to 5% and 95 tickets were given out over the course of this budget, then the owner will be able to mint 5 tickets for themselves once the budget expires."
              />
            }
          >
            {fromPerMille(budget.reserved)}%
          </Descriptions.Item>

          <Descriptions.Item label="Bonding curve rate">
            {fromPerMille(budget.bondingCurveRate)}%
          </Descriptions.Item>
        </Descriptions>
      </CollapsePanel>
    </Collapse>
  )
}
