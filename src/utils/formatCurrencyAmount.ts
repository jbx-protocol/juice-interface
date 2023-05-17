import { CURRENCY_METADATA } from 'constants/currency'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { formatAmount } from './format/formatAmount'
import { V2V3CurrencyName, V2V3_CURRENCY_ETH } from './v2v3/currency'

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
  const currencyName = V2V3CurrencyName(currency)
  if (!currencyName) return

  const currencyMetadata = CURRENCY_METADATA[currencyName]
  const formattedAmount = amount !== undefined ? formatAmount(amount) : '0'

  return `${currencyMetadata.symbol}${formattedAmount}`
}
