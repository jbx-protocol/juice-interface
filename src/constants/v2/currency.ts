import { V1CurrencyOption } from 'models/v1/currencyOption'
import {
  V2CurrencyETH,
  V2CurrencyOption,
  V2CurrencyUSD,
} from 'models/v2/currencyOption'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'

export const V2_CURRENCY_ETH: V2CurrencyETH = 1
export const V2_CURRENCY_USD: V2CurrencyUSD = 2

const CURRENCY_MAP: { [key in V1CurrencyOption]: V2CurrencyOption } = {
  [V1_CURRENCY_ETH]: V2_CURRENCY_ETH,
  [V1_CURRENCY_USD]: V2_CURRENCY_USD,
}

export const toV2Currency = (
  v1Currency: V1CurrencyOption,
): V2CurrencyOption => {
  return CURRENCY_MAP[v1Currency]
}
