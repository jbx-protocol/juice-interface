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
      {fundingCycle.duration.gt(0) && (
        <Descriptions.Item label="Start">
          {formattedStartTime}
        </Descriptions.Item>
      )}

      {hasFundingTarget(fundingCycle) && fundingCycle.duration.gt(0) && (
        <Descriptions.Item label="End">{formattedEndTime}</Descriptions.Item>
      )}

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
            tip='Whenever someone pays your project, this percentage of tokens will be reserved and the rest will go to the payer. Reserve tokens are reserved for the project owner by default, but can also be allocated to other wallet addresses by the owner. Once tokens are reserved, anyone can "mint" them, which distributes them to their intended receivers.'
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
              tip="The ratio of tokens rewarded per payment amount will decrease by this percentage with each new funding cycle. A higher discount rate will incentivize supporters to pay your project earlier than later."
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
