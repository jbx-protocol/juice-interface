import { V1CurrencyOption } from 'models/v1/currencyOption'
import {
  V2CurrencyETH,
  V2CurrencyOption,
  V2CurrencyUSD,
} from 'models/v2/currencyOption'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'
import {
  CurrencyMetadata,
  CurrencyName,
  CurrencySymbol,
  CURRENCY_METADATA,
} from 'constants/currency'

export const V2_CURRENCY_ETH: V2CurrencyETH = 1
export const V2_CURRENCY_USD: V2CurrencyUSD = 2

export const V2_CURRENCY_METADATA: Record<V2CurrencyOption, CurrencyMetadata> =
  {
    [V2_CURRENCY_ETH]: CURRENCY_METADATA.ETH,
    [V2_CURRENCY_USD]: CURRENCY_METADATA.USD,
  }

const CURRENCY_MAP: { [key in V1CurrencyOption]: V2CurrencyOption } = {
  [V1_CURRENCY_ETH]: V2_CURRENCY_ETH,
  [V1_CURRENCY_USD]: V2_CURRENCY_USD,
}

export const V2CurrencyName = (
  currency?: V2CurrencyOption,
): CurrencyName | undefined =>
  currency !== undefined ? V2_CURRENCY_METADATA[currency]?.name : undefined

export const getV2CurrencyOption = (
  currencyName: CurrencyName,
): V2CurrencyOption =>
  currencyName === 'ETH' ? V2_CURRENCY_ETH : V2_CURRENCY_USD

export const V2CurrencySymbol = (
  currency?: V2CurrencyOption,
): CurrencySymbol | undefined =>
  currency !== undefined ? V2_CURRENCY_METADATA[currency]?.symbol : undefined

export const V2CurrencyStyle = (currency?: V2CurrencyOption) =>
  currency !== undefined ? V2_CURRENCY_METADATA[currency]?.style : undefined

export const toV2Currency = (
  v1Currency: V1CurrencyOption,
): V2CurrencyOption => {
  return CURRENCY_MAP[v1Currency]
}
