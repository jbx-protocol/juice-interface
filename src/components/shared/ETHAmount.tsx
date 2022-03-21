import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { formatWad, parseWad } from 'utils/formatNumber'
import { betweenZeroAndOne } from 'utils/bigNumbers'

import CurrencySymbol from './CurrencySymbol'

import ETHToUSD from './ETHToUSD'

// Eth amount which displays the equiv USD amount in a tooltip on hover
export default function ETHAmount({
  amount,
  precision,
  padEnd,
}: {
  amount?: BigNumber | string
  precision?: number
  padEnd?: boolean
}) {
  // Account for being passed a string amount or a BigNumber amount
  const isBetweenZeroAndOne =
    (BigNumber.isBigNumber(amount) && betweenZeroAndOne(amount)) ||
    betweenZeroAndOne(parseWad(amount))

  const precisionAdjusted = isBetweenZeroAndOne ? 2 : precision

  const formattedETHAmount = formatWad(amount, {
    precision: precisionAdjusted ?? 0,
    padEnd: padEnd ?? false,
  })

  if (amount) {
    return (
      <Tooltip title={<ETHToUSD ethAmount={amount} />}>
        <CurrencySymbol currency="ETH" />
        {formattedETHAmount}
      </Tooltip>
    )
  }

  return null
}
