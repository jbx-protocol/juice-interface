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
  hideTooltip,
  ...props
}: {
  amount: bigint | undefined
  currency: CurrencyName | undefined
  hideTooltip?: boolean
}) {
  if (currency === 'USD')
    return <USDAmount amount={amount} hideTooltip={hideTooltip} {...props} />
  if (currency === 'ETH')
    return <ETHAmount amount={amount} hideTooltip={hideTooltip} {...props} />
  return null
}
