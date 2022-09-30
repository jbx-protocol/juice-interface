import { isInteger } from 'lodash'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from './v2v3/currency'

const formatAmount = (amount: number) => {
  if (isInteger(amount)) {
    return amount.toString()
  }
  return amount.toFixed(2)
}

/**
 * Format the input amount with the currency.
 *
 * For example, if using `V2V3_CURRENCY_USD` with an amount of 550.1 the format
 * will be `"$550.1 USD"`.
 * @returns
 */
export const formatCurrencyAmount = ({
  amount,
  currency = V2V3_CURRENCY_ETH,
}: {
  amount: number | undefined
  currency: V2V3CurrencyOption | undefined
}) => {
  const currencyPrefix = currency === V2V3_CURRENCY_USD ? '$' : ''
  const currencySuffix = currency === V2V3_CURRENCY_USD ? 'USD' : 'ETH'
  return `${currencyPrefix}${
    amount !== undefined ? formatAmount(amount) : '0'
  } ${currencySuffix}`
}
