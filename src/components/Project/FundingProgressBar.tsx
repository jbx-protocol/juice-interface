import { t } from '@lingui/macro'
import { Progress, Tooltip } from 'antd'
import { JUICE_ORANGE } from 'constants/theme/colors'
import { BigNumber } from 'ethers'
import { useMemo, useState } from 'react'
import { fracDiv } from 'utils/format/formatNumber'

const TargetIndicatorLine = () => (
  <div className="mx-1 mt-0.5 h-4 min-w-[4px] rounded-full bg-black dark:bg-slate-100" />
)

const ProgressWithOverflow = ({
  percentOverflow,
}: {
  percentOverflow: number
}) => {
  const [showTooltips, setShowTooltips] = useState(false)

  return (
    <div
      className="flex items-center pb-2"
      onMouseOver={() => setShowTooltips(true)}
      onMouseEnter={() => setShowTooltips(true)}
      onMouseLeave={() => setShowTooltips(false)}
    >
      <Tooltip
        title={t`This cycle's payouts`}
        open={showTooltips}
        placement="bottomLeft"
      >
        <Progress
          className="min-w-[12px]"
          style={{
            width: (1 - percentOverflow) * 100 + '%',
          }}
          percent={100}
          showInfo={false}
          strokeColor={JUICE_ORANGE}
        />
      </Tooltip>

      <TargetIndicatorLine />

      <Tooltip
        title={t`Remaining ETH`}
        open={showTooltips}
        placement="topRight"
      >
        <Progress
          className="min-w-[12px]"
          style={{
            width: percentOverflow * 100 + '%',
          }}
          percent={100}
          showInfo={false}
          strokeColor={JUICE_ORANGE}
        />
      </Tooltip>
    </div>
  )
}

const ProgressNoOverflow = ({ percentPaid }: { percentPaid: number }) => {
  return (
    <Progress
      percent={percentPaid ? Math.max(percentPaid, 1) : 0}
      showInfo={false}
      strokeColor={JUICE_ORANGE}
    />
  )
}

export default function FundingProgressBar({
  targetAmount,
  balanceInTargetCurrency,
  overflowAmountInTargetCurrency,
}: {
  targetAmount: BigNumber
  balanceInTargetCurrency: BigNumber | undefined
  overflowAmountInTargetCurrency: BigNumber | undefined
}) {
  const percentPaid = useMemo(
    () =>
      balanceInTargetCurrency && targetAmount
        ? fracDiv(balanceInTargetCurrency.toString(), targetAmount.toString()) *
          100
        : 0,
    [balanceInTargetCurrency, targetAmount],
  )

  // Percent overflow of target
  const percentOverflow = useMemo(
    () =>
      fracDiv(
        (
          overflowAmountInTargetCurrency?.sub(targetAmount ?? 0) ?? 0
        ).toString(),
        (targetAmount ?? 0).toString(),
      ),
    [overflowAmountInTargetCurrency, targetAmount],
  )

  const hasTargetAmount = targetAmount.gt(0)
  const hasOverFlow = overflowAmountInTargetCurrency?.gt(0) ?? false

  if (!hasTargetAmount || !hasOverFlow) {
    return <ProgressNoOverflow percentPaid={percentPaid} />
  }

  return <ProgressWithOverflow percentOverflow={percentOverflow} />
}
