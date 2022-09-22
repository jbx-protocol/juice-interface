import {
  V2V3CurrencyETH,
  V2V3CurrencyOption,
  V2V3CurrencyUSD,
} from 'models/v2v3/currencyOption'

import {
  CurrencyMetadata,
  CurrencyName,
  CurrencySymbol,
  CURRENCY_METADATA,
} from 'constants/currency'

// If a project has no fund access constraint,
// then currency will be 0.
// If this is the case, then we'll display the amount as ETH
export const NO_CURRENCY = 0
export const V2V3_CURRENCY_ETH: V2V3CurrencyETH = 1
export const V2V3_CURRENCY_USD: V2V3CurrencyUSD = 2

export const V2V3_CURRENCY_METADATA: Record<
  V2V3CurrencyOption,
  CurrencyMetadata
> = {
  [V2V3_CURRENCY_ETH]: CURRENCY_METADATA.ETH,
  [V2V3_CURRENCY_USD]: CURRENCY_METADATA.USD,
}

export const V2CurrencyName = (
  currency?: V2V3CurrencyOption,
): CurrencyName | undefined =>
  currency !== undefined ? V2V3_CURRENCY_METADATA[currency]?.name : undefined

export const getV2V3CurrencyOption = (
  currencyName: CurrencyName,
): V2V3CurrencyOption =>
  currencyName === 'ETH' ? V2V3_CURRENCY_ETH : V2V3_CURRENCY_USD

export const V2CurrencySymbol = (
  currency?: V2V3CurrencyOption,
): CurrencySymbol | undefined =>
  currency !== undefined ? V2V3_CURRENCY_METADATA[currency]?.symbol : undefined

export const V2CurrencyStyle = (currency?: V2V3CurrencyOption) =>
  currency !== undefined ? V2V3_CURRENCY_METADATA[currency]?.style : undefined
