import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { betweenZeroAndOne } from 'utils/bigNumbers'

import CurrencySymbol from '../CurrencySymbol'

import ETHToUSD from './ETHToUSD'
import { PRECISION_ETH } from 'constants/currency'

/**
 * Render a given amount formatted as ETH. Displays USD amount in a tooltip on hover.
 */
export default function ETHAmount({
  amount,
  precision = PRECISION_ETH,
  padEnd = false,
  fallback,
}: {
  amount: BigNumber | undefined
  precision?: number
  padEnd?: boolean
  fallback?: string
}) {
  // Account for being passed a string amount or a BigNumber amount
  const isBetweenZeroAndOne =
    (BigNumber.isBigNumber(amount) && betweenZeroAndOne(amount)) ||
    betweenZeroAndOne(parseWad(amount))
  const decimalsCount = fromWad(amount).split('.')[1]?.length ?? 0
  const precisionAdjusted = isBetweenZeroAndOne
    ? Math.min(decimalsCount, PRECISION_ETH)
    : precision

  const formattedETHAmount = formatWad(amount, {
    precision: precisionAdjusted,
    padEnd,
  })

  if (amount === undefined) return <span>{fallback}</span> ?? null

  if (Number(formattedETHAmount) === 0) {
    return (
      <>
        <CurrencySymbol currency="ETH" />
        {formattedETHAmount}
      </>
    )
  }

  return (
    <Tooltip title={<ETHToUSD ethAmount={amount} />}>
      <CurrencySymbol currency="ETH" />
      {formattedETHAmount}
    </Tooltip>
  )
}
