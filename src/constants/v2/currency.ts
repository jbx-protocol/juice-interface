import { V2CurrencyETH, V2CurrencyUSD } from 'models/v2/currencyOption'
import { V2_CURRENCY_METADATA } from 'utils/v2/currency'

export const V2_CURRENCY_ETH: V2CurrencyETH = 1
export const V2_CURRENCY_USD: V2CurrencyUSD = 2

export const V2_CURRENCY_CONTEXT = {
  currencyMetadata: V2_CURRENCY_METADATA,
  currencyETH: V2_CURRENCY_ETH,
  currencyUSD: V2_CURRENCY_USD,
}
