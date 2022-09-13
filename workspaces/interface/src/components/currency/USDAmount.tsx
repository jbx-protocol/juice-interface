import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { betweenZeroAndOne } from 'utils/bigNumbers'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'

import { useCurrencyConverter } from 'hooks/CurrencyConverter'

import { PRECISION_USD } from 'constants/currency'
import CurrencySymbol from '../CurrencySymbol'

/**
 * Render a given amount formatted as USD. Displays ETH amount in a tooltip on hover.
 */
export default function USDAmount({
  amount,
  precision,
  padEnd,
}: {
  amount?: BigNumber | string
  precision?: number
  padEnd?: boolean
}) {
  const converter = useCurrencyConverter()

  // Account for being passed a string amount or a BigNumber amount
  const isBetweenZeroAndOne =
    (BigNumber.isBigNumber(amount) && betweenZeroAndOne(amount)) ||
    betweenZeroAndOne(parseWad(amount))

  const precisionAdjusted = isBetweenZeroAndOne ? PRECISION_USD : precision

  const formattedUSDAmount = formatWad(amount, {
    precision: precisionAdjusted ?? 0,
    padEnd: padEnd ?? false,
  })

  const ETHAmount = converter.usdToWei(fromWad(amount))
  const formattedETHAmount = formatWad(ETHAmount, {
    precision: precisionAdjusted ?? 0,
    padEnd: padEnd ?? false,
  })

  if (!amount) return null

  return (
    <Tooltip
      title={
        <span>
          <CurrencySymbol currency="ETH" />
          {formattedETHAmount}
        </span>
      }
    >
      <CurrencySymbol currency="USD" />
      {formattedUSDAmount}
    </Tooltip>
  )
}
