import { BigNumber } from '@ethersproject/bignumber'
import { Progress, Tooltip } from 'antd'
import { Property } from 'csstype'

import { t } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useMemo, useState } from 'react'
import { fracDiv } from 'utils/formatNumber'

const TargetIndicatorLine = (
  props: { color: Property.Color } & React.DOMAttributes<HTMLDivElement>,
) => (
  <div
    {...props}
    style={{
      minWidth: 4,
      height: 15,
      borderRadius: 2,
      background: props.color,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 3,
    }}
  ></div>
)

const ProgressWithOverflow = ({
  percentOverflow,
}: {
  percentOverflow: number
}) => {
  const [showTooltips, setShowTooltips] = useState(false)
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', paddingBottom: 8 }}
      onMouseOver={() => setShowTooltips(true)}
      onMouseEnter={() => setShowTooltips(true)}
      onMouseLeave={() => setShowTooltips(false)}
    >
      <Tooltip
        title={t`Distributed`}
        visible={showTooltips}
        placement="bottomLeft"
      >
        <Progress
          style={{
            width: (1 - percentOverflow) * 100 + '%',
            minWidth: 12,
          }}
          percent={100}
          showInfo={false}
          strokeColor={colors.text.brand.primary}
        />
      </Tooltip>

      <TargetIndicatorLine color={colors.text.primary} />

      <Tooltip title={t`Overflow`} visible={showTooltips} placement="topRight">
        <Progress
          style={{
            width: percentOverflow * 100 + '%',
            minWidth: 12,
          }}
          percent={100}
          showInfo={false}
          strokeColor={colors.text.brand.primary}
        />
      </Tooltip>
    </div>
  )
}

const ProgressNoOverflow = ({ percentPaid }: { percentPaid: number }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <Progress
      percent={percentPaid ? Math.max(percentPaid, 1) : 0}
      showInfo={false}
      strokeColor={colors.text.brand.primary}
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
