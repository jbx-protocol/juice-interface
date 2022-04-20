import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { formatWad, parseWad } from 'utils/formatNumber'
import { betweenZeroAndOne } from 'utils/bigNumbers'
import { t, Trans } from '@lingui/macro'

import * as constants from '@ethersproject/constants'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'

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
  amount?: BigNumber | string
  precision?: number
  padEnd?: boolean
}) {
  const isMaxUint =
    BigNumber.isBigNumber(amount) &&
    (amount.eq(constants.MaxUint256) || amount.eq(MAX_DISTRIBUTION_LIMIT))

  if (isMaxUint) {
    return (
      <Tooltip title={t`Distribution limit infinite`}>
        <Trans>No limit</Trans>
      </Tooltip>
    )
  }

  // Account for being passed a string amount or a BigNumber amount
  const isBetweenZeroAndOne =
    (BigNumber.isBigNumber(amount) && betweenZeroAndOne(amount)) ||
    betweenZeroAndOne(parseWad(amount))

  const precisionAdjusted = isBetweenZeroAndOne ? 4 : precision

  const formattedETHAmount = formatWad(amount, {
    precision: precisionAdjusted,
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
