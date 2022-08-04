import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { betweenZeroAndOne } from 'utils/bigNumbers'

import CurrencySymbol from '../CurrencySymbol'

import ETHToUSD from './ETHToUSD'
import { PRECISION_ETH } from 'constants/currency'

const MIN_AMOUNT = parseWad(0.00001)

/**
 * Render a given amount formatted as ETH. Displays USD amount in a tooltip on hover.
 */
export default function ETHAmount({
  amount,
  precision = PRECISION_ETH,
  padEnd = false,
  fallback,
}: {
  amount: BigNumber | undefined // in wad (18 decimals)
  precision?: number
  padEnd?: boolean
  fallback?: string
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

  const formattedETHAmount = amount?.lte(MIN_AMOUNT)
    ? '~0'
    : formatWad(amount, {
        precision: precisionAdjusted,
        padEnd,
      })

  return (
    <Tooltip title={<ETHToUSD ethAmount={amount} />}>
      <CurrencySymbol currency="ETH" />
      {formattedETHAmount}
    </Tooltip>
  )
}
