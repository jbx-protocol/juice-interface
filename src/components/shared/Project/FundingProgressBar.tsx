import { BigNumber } from '@ethersproject/bignumber'
import { Progress } from 'antd'
import { Property } from 'csstype'

import { ThemeContext } from 'contexts/themeContext'
import { useContext, useMemo } from 'react'
import { fracDiv } from 'utils/formatNumber'

const TargetIndicatorLine = ({ color }: { color: Property.Color }) => (
  <div
    style={{
      minWidth: 4,
      height: 15,
      borderRadius: 2,
      background: color,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 3,
    }}
  ></div>
)

export default function FundingProgressBar({
  targetAmount,
  balanceInTargetCurrency,
  overflowAmountInTargetCurrency,
}: {
  targetAmount: BigNumber
  balanceInTargetCurrency: BigNumber | undefined
  overflowAmountInTargetCurrency: BigNumber | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const percentPaid = useMemo(
    () =>
      balanceInTargetCurrency && targetAmount
        ? fracDiv(balanceInTargetCurrency.toString(), targetAmount.toString()) *
          100
        : 0,
    [balanceInTargetCurrency, targetAmount],
  )

  // Percent overflow of target
  const percentOverflow = fracDiv(
    (overflowAmountInTargetCurrency?.sub(targetAmount ?? 0) ?? 0).toString(),
    (targetAmount ?? 0).toString(),
  )

  const ProgressWithOverflow = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Progress
          style={{
            width: (1 - percentOverflow) * 100 + '%',
            minWidth: 10,
          }}
          percent={100}
          showInfo={false}
          strokeColor={colors.text.brand.primary}
        />

        <TargetIndicatorLine color={colors.text.primary} />

        <Progress
          style={{
            width: percentOverflow * 100 + '%',
            minWidth: 10,
          }}
          percent={100}
          showInfo={false}
          strokeColor={colors.text.brand.primary}
        />
      </div>
    )
  }

  const ProgressNoOverflow = () => {
    return (
      <Progress
        percent={percentPaid ? Math.max(percentPaid, 1) : 0}
        showInfo={false}
        strokeColor={colors.text.brand.primary}
      />
    )
  }

  return overflowAmountInTargetCurrency?.gt(0) ? (
    <ProgressWithOverflow />
  ) : (
    <ProgressNoOverflow />
  )
}
