import { BigNumber } from '@ethersproject/bignumber'
import ETHAmount from 'components/currency/ETHAmount'
import USDAmount from 'components/currency/USDAmount'
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
    return <ETHAmount amount={amount} precision={precision} padEnd />
  }

  if (currency?.eq(V2V3_CURRENCY_USD)) {
    return <USDAmount amount={amount} precision={precision} padEnd />
  }

  return null
}
