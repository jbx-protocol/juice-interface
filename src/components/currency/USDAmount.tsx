import { Tooltip } from 'antd'
import { PRECISION_USD } from 'constants/currency'
import { BigNumber } from 'ethers'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import CurrencySymbol from './CurrencySymbol'
import ETHAmount from './ETHAmount'

/**
 * Render a given amount formatted as USD. Displays ETH amount in a tooltip on hover.
 */
export default function USDAmount({
  amount,
  precision,
  padEnd,
  symbol,
  tooltipContent,
  className,
}: {
  amount?: BigNumber | string
  precision?: number
  padEnd?: boolean
  symbol?: string | JSX.Element
  tooltipContent?: JSX.Element
  className?: string
}) {
  const converter = useCurrencyConverter()
  const usdAmountInEth = converter.usdToWei(fromWad(amount))

  const formattedUSDAmount = formatWad(amount, {
    precision: precision ?? PRECISION_USD,
    padEnd: padEnd ?? false,
  })

  if (!amount) return null

  return (
    <Tooltip title={tooltipContent ?? <ETHAmount amount={usdAmountInEth} />}>
      <span className={className}>
        {symbol ?? <CurrencySymbol currency="USD" />}
        {formattedUSDAmount}
      </span>
    </Tooltip>
  )
}
