import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { betweenZeroAndOne } from 'utils/bigNumbers'

import CurrencySymbol from '../CurrencySymbol'

import ETHToUSD from './ETHToUSD'

const MAX_PRECISION = 6

/**
 * Render a given amount formatted as ETH. Displays USD amount in a tooltip on hover.
 */
export default function ETHAmount({
  amount,
  precision = 0,
  padEnd = false,
}: {
  amount?: BigNumber | string
  precision?: number
  padEnd?: boolean
}) {
  // Account for being passed a string amount or a BigNumber amount
  const isBetweenZeroAndOne =
    (BigNumber.isBigNumber(amount) && betweenZeroAndOne(amount)) ||
    betweenZeroAndOne(parseWad(amount))

  const decimalsCount = fromWad(amount).split('.')[1]?.length ?? 0

  const precisionAdjusted = isBetweenZeroAndOne
    ? Math.min(decimalsCount, MAX_PRECISION)
    : precision

  const formattedETHAmount = formatWad(amount, {
    precision: precisionAdjusted,
    padEnd,
  })

  if (amount === undefined) return null

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
