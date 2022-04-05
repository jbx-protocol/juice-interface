import { BigNumber } from '@ethersproject/bignumber'
import ETHAmount from 'components/shared/currency/ETHAmount'
import USDAmount from 'components/shared/currency/USDAmount'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'utils/v2/currency'

export default function V2CurrencyAmount({
  amount,
  currency,
  precision = 2,
}: {
  amount: BigNumber | undefined
  currency: BigNumber | undefined
  precision?: number
}) {
  if (!amount) return null

  if (currency?.eq(V2_CURRENCY_ETH)) {
    return <ETHAmount amount={amount} precision={precision} padEnd />
  }

  if (currency?.eq(V2_CURRENCY_USD)) {
    return <USDAmount amount={amount} precision={precision} padEnd />
  }

  return null
}
