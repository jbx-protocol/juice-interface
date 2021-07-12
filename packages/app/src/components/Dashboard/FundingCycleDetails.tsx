import { Descriptions } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { formatDate } from 'utils/formatDate'
import { formatWad, fromPerbicent, fromPermille } from 'utils/formatNumber'
import {
  decodeFCMetadata,
  hasFundingTarget,
  isRecurring,
} from 'utils/fundingCycle'

import TooltipLabel from '../shared/TooltipLabel'

export default function FundingCycleDetails({
  fundingCycle,
}: {
  fundingCycle: FundingCycle | undefined
}) {
  if (!fundingCycle) return null

  const formattedStartTime = formatDate(fundingCycle.start.mul(1000))

  const secondsInDay = 24 * 60 * 60

  const formattedEndTime = formatDate(
    fundingCycle.start.add(fundingCycle.duration.mul(secondsInDay)).mul(1000),
  )

  const metadata = decodeFCMetadata(fundingCycle.metadata)

  return (
    <Descriptions
      labelStyle={{ fontWeight: 600 }}
      size="small"
      column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }}
    >
      <Descriptions.Item label="Start">{formattedStartTime}</Descriptions.Item>

      <Descriptions.Item label="End">{formattedEndTime}</Descriptions.Item>

      {hasFundingTarget(fundingCycle) && (
        <Descriptions.Item label="Target">
          <CurrencySymbol
            currency={fundingCycle.currency.toNumber() as CurrencyOption}
          />
          {formatWad(fundingCycle.target)}
        </Descriptions.Item>
      )}

      <Descriptions.Item
        label={
          <TooltipLabel
            label="Reserved"
            tip="This project's owner can mint tokens for themselves to share in the overflow with all contributors. For example, if this is set to 5% and 95 tokens were given out over the course of this budget, then the owner will be able to mint 5 tokens for themselves once the budget expires."
          />
        }
      >
        {fromPerbicent(metadata?.reservedRate)}%
      </Descriptions.Item>

      {isRecurring(fundingCycle) && hasFundingTarget(fundingCycle) && (
        <Descriptions.Item
          label={
            <TooltipLabel
              label="Discount rate"
              tip="The rate at which payments to future
        budgeting time frames are valued compared to payments to the current one. For example, if this is set to 97%, then someone who pays 100 towards the next budgeting time frame will only receive 97% the amount of tokens received by someone who paid 100 towards this budgeting time frame.  This rewards your earlier adopters."
            />
          }
        >
          {fromPermille(fundingCycle.discountRate)}%
        </Descriptions.Item>
      )}

      {isRecurring(fundingCycle) && hasFundingTarget(fundingCycle) && (
        <Descriptions.Item
          label={
            <TooltipLabel
              label="Bonding curve"
              tip="This rate determines the amount of overflow that each token can be redeemed for at any given time. On a lower bonding curve, redeeming a token increases the value of each remaining token, creating an incentive to hodl tokens longer than others. A bonding curve of 100% means all tokens will have equal value regardless of when they are redeemed."
            />
          }
        >
          {fromPerbicent(metadata?.bondingCurveRate)}%
        </Descriptions.Item>
      )}
    </Descriptions>
  )
}
