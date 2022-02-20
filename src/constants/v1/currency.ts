import { V2CurrencyOption } from 'models/v2/currencyOption'
import {
  V1CurrencyETH,
  V1CurrencyOption,
  V1CurrencyUSD,
} from 'models/v1/currencyOption'

import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'constants/v2/currency'

export const V1_CURRENCY_ETH: V1CurrencyETH = 0
export const V1_CURRENCY_USD: V1CurrencyUSD = 1

const CURRENCY_MAP: { [key in V2CurrencyOption]: V1CurrencyOption } = {
  [V2_CURRENCY_ETH]: V1_CURRENCY_ETH,
  [V2_CURRENCY_USD]: V1_CURRENCY_USD,
}

export const toV1Currency = (
  v2Currency: V2CurrencyOption,
): V1CurrencyOption => {
  return CURRENCY_MAP[v2Currency]
}
