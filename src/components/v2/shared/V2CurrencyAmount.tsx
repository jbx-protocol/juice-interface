import { BigNumber } from '@ethersproject/bignumber'
import ETHAmount from 'components/shared/currency/ETHAmount'
import USDAmount from 'components/shared/currency/USDAmount'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'utils/v2/currency'

// If a project has no fund access constraint,
// then currency will be 0.
// If this is the case, then we'll display the amount as ETH
const NO_CURRENCY = 0

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

  if (currency?.eq(NO_CURRENCY) || currency?.eq(V2_CURRENCY_ETH)) {
    return <ETHAmount amount={amount} precision={precision} padEnd />
  }

  if (currency?.eq(V2_CURRENCY_USD)) {
    return <USDAmount amount={amount} precision={precision} padEnd />
  }

  return null
}
