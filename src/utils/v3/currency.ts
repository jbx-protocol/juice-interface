import { V1CurrencyOption } from 'models/v1/currencyOption'
import {
  V3CurrencyETH,
  V3CurrencyOption,
  V3CurrencyUSD,
} from 'models/v3/currencyOption'

import {
  CurrencyMetadata,
  CurrencyName,
  CurrencySymbol,
  CURRENCY_METADATA,
} from 'constants/currency'
import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'

// If a project has no fund access constraint,
// then currency will be 0.
// If this is the case, then we'll display the amount as ETH
export const NO_CURRENCY = 0
export const V3_CURRENCY_ETH: V3CurrencyETH = 1
export const V3_CURRENCY_USD: V3CurrencyUSD = 2

export const V3_CURRENCY_METADATA: Record<V3CurrencyOption, CurrencyMetadata> =
  {
    [V3_CURRENCY_ETH]: CURRENCY_METADATA.ETH,
    [V3_CURRENCY_USD]: CURRENCY_METADATA.USD,
  }

const CURRENCY_MAP: { [key in V1CurrencyOption]: V3CurrencyOption } = {
  [V1_CURRENCY_ETH]: V3_CURRENCY_ETH,
  [V1_CURRENCY_USD]: V3_CURRENCY_USD,
}

export const V3CurrencyName = (
  currency?: V3CurrencyOption,
): CurrencyName | undefined =>
  currency !== undefined ? V3_CURRENCY_METADATA[currency]?.name : undefined

export const getV3CurrencyOption = (
  currencyName: CurrencyName,
): V3CurrencyOption =>
  currencyName === 'ETH' ? V3_CURRENCY_ETH : V3_CURRENCY_USD

export const V3CurrencySymbol = (
  currency?: V3CurrencyOption,
): CurrencySymbol | undefined =>
  currency !== undefined ? V3_CURRENCY_METADATA[currency]?.symbol : undefined

export const V3CurrencyStyle = (currency?: V3CurrencyOption) =>
  currency !== undefined ? V3_CURRENCY_METADATA[currency]?.style : undefined

export const toV3Currency = (
  v1Currency: V1CurrencyOption,
): V3CurrencyOption => {
  return CURRENCY_MAP[v1Currency]
}
