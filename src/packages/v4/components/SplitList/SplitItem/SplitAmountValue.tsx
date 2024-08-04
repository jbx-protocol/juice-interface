import { DollarCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { CurrencyName } from 'constants/currency'
import { SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import { NativeTokenValue, useReadJbMultiTerminalFee } from 'juice-sdk-react'
import { V4CurrencyOption } from 'packages/v4/models/v4CurrencyOption'
import { V4CurrencyName } from 'packages/v4/utils/currency'
import { isJuiceboxProjectSplit } from 'packages/v4/utils/v4Splits'
import { formatWad } from 'utils/format/formatNumber'
import { feeForAmount } from 'utils/math'
import { SplitProps } from './SplitItem'

export function SplitAmountValue({
  props,
  hideTooltip,
}: {
  props: SplitProps
  hideTooltip?: boolean
}) {
  const { data: primaryNativeTerminalFee } = useReadJbMultiTerminalFee()

  const splitValue = props.totalValue
    ? (props.totalValue * props.split.percent.value) /
      BigInt(SPLITS_TOTAL_PERCENT)
    : undefined

  const isJuiceboxProject = isJuiceboxProjectSplit(props.split)
  const hasFee = !isJuiceboxProject && !props.dontApplyFeeToAmount
  const feeAmount = hasFee
    ? feeForAmount(splitValue, primaryNativeTerminalFee) ?? 0n
    : 0n
  const valueAfterFees = splitValue ? splitValue - feeAmount : 0

  const currencyName = V4CurrencyName(
    Number(props.currency) as V4CurrencyOption,
  )

  const createTooltipTitle = (
    curr: CurrencyName | undefined,
    amount: bigint | undefined,
  ) => {
    if (hideTooltip || !amount) return undefined
    return <NativeTokenValue wei={amount} />
  }

  return (
    <>
      <Tooltip
        title={
          splitValue !== undefined &&
          feeAmount !== undefined &&
          createTooltipTitle(currencyName, BigInt(splitValue) - feeAmount)
        }
      >
        {valueAfterFees ? (
          <>
            {currencyName ? (
              // <AmountInCurrency
              //   amount={valueAfterFees}
              //   currency={currencyName}
              //   hideTooltip={hideTooltip}
              // />
              <NativeTokenValue wei={valueAfterFees} />
            ) : (
              // if no currency, assume its a token with 18 decimals (a wad)
              <>{formatWad(valueAfterFees, { precision: 2 })}</>
            )}
            {props.valueSuffix ? <span> {props.valueSuffix}</span> : null}
          </>
        ) : null}
      </Tooltip>

      {props.showFee && !isJuiceboxProject && (
        <Tooltip
          title={
            <Trans>
              <NativeTokenValue wei={feeAmount} />
              fee
            </Trans>
          }
          className="ml-1"
        >
          <DollarCircleOutlined />
        </Tooltip>
      )}
    </>
  )
}
