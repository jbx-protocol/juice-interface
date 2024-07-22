import { DollarCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import ETHToUSD from 'components/currency/ETHToUSD'
import { CurrencyName } from 'constants/currency'
import { BigNumber } from 'ethers'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3CurrencyName } from 'packages/v2v3/utils/currency'
import { isJuiceboxProjectSplit } from 'packages/v2v3/utils/distributions'
import { SPLITS_TOTAL_PERCENT } from 'packages/v2v3/utils/math'
import { useContext } from 'react'
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
  const { primaryETHTerminalFee } = useContext(V2V3ProjectContext)

  const splitValue = props.totalValue
    ?.mul(props.split.percent)
    .div(SPLITS_TOTAL_PERCENT)

  const isJuiceboxProject = isJuiceboxProjectSplit(props.split)
  const hasFee = !isJuiceboxProject && !props.dontApplyFeeToAmount
  const _feeAmount = hasFee
    ? feeForAmount(splitValue?.toBigInt(), primaryETHTerminalFee?.toBigInt()) ?? 0n
    : 0n
  const feeAmount = BigNumber.from(_feeAmount)
  const valueAfterFees = splitValue ? splitValue.sub(feeAmount) : 0

  const currencyName = V2V3CurrencyName(
    props.currency?.toNumber() as V2V3CurrencyOption | undefined,
  )

  const createTooltipTitle = (
    curr: CurrencyName | undefined,
    amount: BigNumber | undefined,
  ) => {
    if (hideTooltip) return undefined
    if (curr === 'ETH' && amount?.gt(0)) {
      return <ETHToUSD ethAmount={amount} />
    }
    return undefined
  }

  return (
    <>
      <Tooltip
        title={
          splitValue &&
          feeAmount &&
          createTooltipTitle(currencyName, splitValue.sub(feeAmount))
        }
      >
        {valueAfterFees ? (
          <>
            {currencyName ? (
              <AmountInCurrency
                amount={valueAfterFees}
                currency={currencyName}
                hideTooltip={hideTooltip}
              />
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
              <AmountInCurrency amount={feeAmount} currency={currencyName} />{' '}
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
