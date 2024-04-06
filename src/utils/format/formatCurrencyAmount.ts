import {
  CURRENCY_METADATA,
  PRECISION_ETH,
  PRECISION_USD,
} from 'constants/currency'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3CurrencyName, V2V3_CURRENCY_ETH } from '../v2v3/currency'
import { formatAmount, formatAmountWithScale } from './formatAmount'

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
  withScale = false,
}: {
  amount: number | string | undefined
  currency: V2V3CurrencyOption | undefined
  withScale?: boolean
}) => {
  const currencyName = V2V3CurrencyName(currency)
  if (!currencyName) return

  const currencyMetadata = CURRENCY_METADATA[currencyName]
  let formattedAmount
  if (withScale) {
    formattedAmount = amount !== undefined ? formatAmountWithScale(amount) : '0'
  } else {
    formattedAmount =
      amount !== undefined
        ? formatAmount(amount, {
            maximumFractionDigits:
              currency === V2V3_CURRENCY_ETH ? PRECISION_ETH : PRECISION_USD,
          })
        : '0'
  }
  return `${currencyMetadata.symbol}${formattedAmount}`
}
