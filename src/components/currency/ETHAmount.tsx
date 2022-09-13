import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { betweenZeroAndOne } from 'utils/bigNumbers'
import { formatWad, fromWad, parseWad } from 'utils/format/formatNumber'

import CurrencySymbol from '../CurrencySymbol'

import { PRECISION_ETH } from 'constants/currency'
import ETHToUSD from './ETHToUSD'

const MIN_AMOUNT = parseWad(0.0001)

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

  const precisionAdjusted = betweenZeroAndOne(amount)
    ? Math.min(decimalsCount, PRECISION_ETH)
    : precision

  if (amount?.lte(MIN_AMOUNT)) {
    return (
      <Tooltip
        title={
          <span>
            <CurrencySymbol currency="ETH" />
            {formatWad(amount, { precision: 8 })}
          </span>
        }
        visible={hideTooltip ? !hideTooltip : undefined}
      >
        <CurrencySymbol currency="ETH" />
        ~0
      </Tooltip>
    )
  }

  const formattedETHAmount = formatWad(amount, {
    precision: precisionAdjusted,
    padEnd,
  })

  return (
    <Tooltip
      title={<ETHToUSD ethAmount={amount} />}
      visible={hideTooltip ? !hideTooltip : undefined}
    >
      <CurrencySymbol currency="ETH" />
      {formattedETHAmount}
    </Tooltip>
  )
}
