import { DollarCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import CurrencySymbol from 'components/CurrencySymbol'
import { CurrencyName } from 'constants/currency'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { formatWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { feeForAmount, SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'
import { SplitProps } from './SplitItem'

const VALUE_PRECISION = 4

export function SplitAmountValue({ props }: { props: SplitProps }) {
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()
  const splitValue = props.totalValue
    ?.mul(props.split.percent)
    .div(SPLITS_TOTAL_PERCENT)

  const isJuiceboxProject = isJuiceboxProjectSplit(props.split)
  const hasFee = !isJuiceboxProject && !props.dontApplyFeeToAmount

  const feeAmount = hasFee
    ? feeForAmount(splitValue, ETHPaymentTerminalFee)
    : BigNumber.from(0)
  const valueFormatted = formatWad(splitValue, { precision: VALUE_PRECISION })

  const valueAfterFeeFormatted =
    splitValue &&
    feeAmount &&
    formatWad(splitValue.sub(feeAmount), {
      ...props,
      precision: VALUE_PRECISION,
    })
  const feeAmountFormatted = formatWad(feeAmount, {
    ...props,
    precision: VALUE_PRECISION,
  })

  const curr = V2V3CurrencyName(
    props.currency?.toNumber() as V2V3CurrencyOption | undefined,
  )

  const createTooltipTitle = (
    curr: CurrencyName | undefined,
    amount: BigNumber | undefined,
  ) => {
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
          createTooltipTitle(curr, splitValue.sub(feeAmount))
        }
      >
        <span>
          (
          <CurrencySymbol currency={curr} />
          {props.dontApplyFeeToAmount ? valueFormatted : valueAfterFeeFormatted}
          {props.valueSuffix ? <span> {props.valueSuffix}</span> : null})
        </span>
      </Tooltip>
      {props.showFee && !isJuiceboxProject && (
        <Tooltip
          title={
            <Trans>
              <CurrencySymbol currency={curr} />
              {feeAmountFormatted} fee
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
