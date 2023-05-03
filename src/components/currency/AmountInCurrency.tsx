import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyName } from 'constants/currency'
import ETHAmount from './ETHAmount'
import USDAmount from './USDAmount'

/**
 *
 * @returns amount in ETH by default. Specified currency otherwise
 */
export function AmountInCurrency({
  currency,
  amount,
  ...props
}: {
  amount: BigNumber | undefined
  currency?: CurrencyName
}) {
  if (currency === 'USD') return <USDAmount amount={amount} {...props} />
  return <ETHAmount amount={amount} {...props} />
}
