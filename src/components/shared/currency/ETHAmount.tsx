import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { formatWad } from 'utils/formatNumber'

import CurrencySymbol from '../CurrencySymbol'

import ETHToUSD from './ETHToUSD'

/**
 * Render a given amount formatted as ETH. Displays USD amount in a tooltip on hover.
 */
export default function ETHAmount({
  amount,
  precision = 0,
  padEnd = false,
}: {
  amount: BigNumber | string | undefined
  precision?: number
  padEnd?: boolean
}) {
  const formattedETHAmount = formatWad(amount, {
    precision,
    padEnd,
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
