import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyName } from 'constants/currency'
import ETHAmount from './ETHAmount'
import USDAmount from './USDAmount'

export function AmountInCurrency({
  currency,
  amount,
  ...props
}: {
  amount: BigNumber | undefined
  currency?: CurrencyName
}) {
  if (currency === 'ETH') return <ETHAmount amount={amount} {...props} />
  if (currency === 'USD') return <USDAmount amount={amount} {...props} />
  return null
}
