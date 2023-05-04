import ETHAmount from 'components/currency/ETHAmount'
import USDAmount from 'components/currency/USDAmount'
import { BigNumber } from 'ethers'
import {
  NO_CURRENCY,
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'utils/v2v3/currency'

export default function V2V3CurrencyAmount({
  amount,
  currency,
  precision = 2,
}: {
  amount: BigNumber | undefined
  currency: BigNumber | undefined
  precision?: number
}) {
  if (amount === undefined) return null

  if (currency?.eq(NO_CURRENCY) || currency?.eq(V2V3_CURRENCY_ETH)) {
    return <ETHAmount amount={amount} precision={precision} />
  }

  if (currency?.eq(V2V3_CURRENCY_USD)) {
    return <USDAmount amount={amount} precision={precision} />
  }

  return null
}
