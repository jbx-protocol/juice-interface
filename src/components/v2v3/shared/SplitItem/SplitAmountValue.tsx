import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import CurrencySymbol from 'components/CurrencySymbol'
import { Parenthesis } from 'components/Parenthesis'
import { CurrencyName } from 'constants/currency'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { formatWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { feeForAmount, SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'
import { SplitProps } from './SplitItem'

export function SplitAmountValue({ props }: { props: SplitProps }) {
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()
  const splitValue = props.totalValue
    ?.mul(props.split.percent)
    .div(SPLITS_TOTAL_PERCENT)
  const isJuiceboxProject = isJuiceboxProjectSplit(props.split)
  const feeAmount = !isJuiceboxProject
    ? feeForAmount(splitValue, ETHPaymentTerminalFee)
    : BigNumber.from(0)
  const splitValueFormatted =
    splitValue &&
    feeAmount &&
    formatWad(splitValue.sub(feeAmount), {
      ...props,
      precision: 4,
    })
  const feeAmountFormatted = formatWad(feeAmount, {
    ...props,
    precision: 4,
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
          {props.showFees
            ? splitValueFormatted
            : formatWad(splitValue, { precision: 0 })}
          {props.valueSuffix ? <span> {props.valueSuffix}</span> : null})
        </span>
      </Tooltip>

      <Tooltip title={createTooltipTitle(curr, feeAmount)}>
        <div className="ml-2 text-sm text-grey-500 dark:text-grey-300">
          {props.showFees && !isJuiceboxProject && (
            <Parenthesis>
              <Trans>
                <CurrencySymbol currency={curr} />
                {feeAmountFormatted} fee
              </Trans>
            </Parenthesis>
          )}
        </div>
      </Tooltip>
    </>
  )
}
