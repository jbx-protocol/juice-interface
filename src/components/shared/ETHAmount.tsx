import { Tooltip } from 'antd'

import { BigNumber } from 'ethers'
import { formatWad, parseWad } from 'utils/formatNumber'
import { betweenZeroAndOne } from 'utils/bigNumbers'

import CurrencySymbol from './CurrencySymbol'

import { V1_CURRENCY_ETH } from 'constants/v1/currency'

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
        <CurrencySymbol currency={V1_CURRENCY_ETH} />
        {formattedETHAmount}
      </Tooltip>
    )
  }
  return null
}
