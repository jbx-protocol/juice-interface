import { BigNumber } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import { PRECISION_ETH } from 'constants/currency'
import { betweenZeroAndOne } from 'utils/bigNumbers'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import CurrencySymbol from '../CurrencySymbol'
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
  if (amount === undefined) return fallback ? <span>{fallback}</span> : null

  if (amount?.isZero()) {
    return (
      <>
        <CurrencySymbol currency="ETH" />0
      </>
    )
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

  if (isBelowZero) {
    return (
      <Tooltip
        title={
          <span>
            <CurrencySymbol currency="ETH" />
            {formatWad(amount)}
          </span>
        }
        open={hideTooltip ? !hideTooltip : undefined}
      >
        {formattedETHAmount === '0' ? '~' : null}
        <CurrencySymbol currency="ETH" />
        {formattedETHAmount}
      </Tooltip>
    )
  }

  return (
    <Tooltip
      title={<ETHToUSD ethAmount={amount} />}
      open={hideTooltip ? !hideTooltip : undefined}
    >
      {formattedETHAmount === '0' ? '~' : null}
      <CurrencySymbol currency="ETH" />
      {formattedETHAmount}
    </Tooltip>
  )
}
