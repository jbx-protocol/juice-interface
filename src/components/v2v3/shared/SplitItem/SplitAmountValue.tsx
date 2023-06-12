import { DollarCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import ETHToUSD from 'components/currency/ETHToUSD'
import { Parenthesis } from 'components/Parenthesis'
import { CurrencyName } from 'constants/currency'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { feeForAmount, SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'
import { SplitProps } from './SplitItem'

export function SplitAmountValue({ props }: { props: SplitProps }) {
  const { primaryETHTerminalFee } = useContext(V2V3ProjectContext)

  const splitValue = props.totalValue
    ?.mul(props.split.percent)
    .div(SPLITS_TOTAL_PERCENT)

  const isJuiceboxProject = isJuiceboxProjectSplit(props.split)
  const hasFee = !isJuiceboxProject && !props.dontApplyFeeToAmount
  const feeAmount = hasFee
    ? feeForAmount(splitValue, primaryETHTerminalFee) ?? BigNumber.from(0)
    : BigNumber.from(0)
  const valueAfterFees = splitValue ? splitValue.sub(feeAmount) : 0

  const currencyName = V2V3CurrencyName(
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
          createTooltipTitle(currencyName, splitValue.sub(feeAmount))
        }
      >
        <span className="pl-1">
          {valueAfterFees ? (
            <Parenthesis>
              <AmountInCurrency
                amount={valueAfterFees}
                currency={currencyName}
              />
              {props.valueSuffix ? <span> {props.valueSuffix}</span> : null}
            </Parenthesis>
          ) : null}
        </span>
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
