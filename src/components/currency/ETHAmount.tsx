import { Tooltip } from 'antd'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import { PRECISION_ETH } from 'constants/currency'
import { BigNumber } from 'ethers'
import { betweenZeroAndOne } from 'utils/bigNumbers'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import ETHToUSD from './ETHToUSD'

const MIN_ETH_PRECISION = 5

/**
 * Render a given amount formatted as ETH. Displays USD amount in a tooltip on hover.
 */
export default function ETHAmount({
  amount,
  precision = PRECISION_ETH,
  padEnd = false,
  fallback,
  hideTooltip,
}: {
  amount: BigNumber | undefined // in wad (18 decimals)
  precision?: number
  padEnd?: boolean
  fallback?: string
  hideTooltip?: boolean
}) {
  const symbol = <CurrencySymbol currency="ETH" />
  if (amount === undefined) return fallback ? <span>{fallback}</span> : null

  if (amount?.isZero()) {
    return <>{symbol}0</>
  }

  const decimalsCount = fromWad(amount).split('.')[1]?.length ?? 0
  const isBelowZero = betweenZeroAndOne(amount)

  const precisionAdjusted = isBelowZero
    ? Math.min(MIN_ETH_PRECISION, Math.max(decimalsCount, PRECISION_ETH))
    : precision

  const formattedETHAmount = formatWad(amount, {
    precision: precisionAdjusted,
    padEnd,
  })

  const isApproximatelyZero = formattedETHAmount === '0'

  return (
    <Tooltip
      title={
        isApproximatelyZero ? (
          <span>
            {symbol}
            {formatWad(amount)}
          </span>
        ) : (
          <ETHToUSD ethAmount={amount} />
        )
      }
      open={hideTooltip ? !hideTooltip : undefined}
    >
      <span className="inline-flex items-center">
        {isApproximatelyZero ? '~' : null}
        {symbol}
        <span>{formattedETHAmount}</span>
      </span>
    </Tooltip>
  )
}
