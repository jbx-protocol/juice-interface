import {
  CURRENCY_METADATA,
  CurrencyMetadata,
  CurrencyName,
} from 'constants/currency'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'packages/v2v3/utils/currency'
import {
  V4V5CurrencyETH,
  V4V5CurrencyOption,
  V4V5CurrencyUSD,
} from '../models/v4CurrencyOption'

import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { USD_CURRENCY_ID } from 'juice-sdk-core'

export const V4V5_CURRENCY_ETH: V4V5CurrencyETH = 1

/**
 * Get the USD currency ID for a specific version
 * V4: USD = 3 (due to botched price feed at index 2)
 * V5: USD = 2
 */
export const getV4V5CurrencyUSD = (version: 4 | 5): V4V5CurrencyUSD => {
  return USD_CURRENCY_ID(version)
}

/**
 * @deprecated Use getV4V5CurrencyUSD(version) instead for version-aware currency ID
 * This constant assumes V5 and may cause issues with V4 projects
 */
export const V4V5_CURRENCY_USD: V4V5CurrencyUSD = 2

// Support both V4 (USD=3) and V5 (USD=2)
const V4_CURRENCY_USD = 3
const V5_CURRENCY_USD = 2

export const V4V5_CURRENCY_METADATA: Record<V4V5CurrencyOption, CurrencyMetadata> =
  {
    [V4V5_CURRENCY_ETH]: CURRENCY_METADATA.ETH,
    [V5_CURRENCY_USD]: CURRENCY_METADATA.USD, // V5
    [V4_CURRENCY_USD]: CURRENCY_METADATA.USD, // V4
  }

export const V4V5CurrencyName = (
  currency?: V4V5CurrencyOption,
): CurrencyName | undefined =>
  currency !== undefined ? V4V5_CURRENCY_METADATA[currency]?.name : undefined

/**
 * Get currency option for a given currency name and version
 * Version-aware to handle V4's USD=3 and V5's USD=2
 */
export const getV4V5CurrencyOption = (
  currencyName: CurrencyName,
  version: 4 | 5,
): V4V5CurrencyOption =>
  currencyName === 'ETH' ? V4V5_CURRENCY_ETH : getV4V5CurrencyUSD(version)


export const convertV4V5CurrencyOptionToV2V3 = (v4CurrencyOption: V4V5CurrencyOption): V2V3CurrencyOption => {
  // Both V4 (3) and V5 (2) USD map to V2V3 USD
  if (v4CurrencyOption === V4V5_CURRENCY_ETH) {
    return V2V3_CURRENCY_ETH
  }
  return V2V3_CURRENCY_USD
}

export const convertV2V3CurrencyOptionToV4V5 = (
  v2v3CurrencyOption: V2V3CurrencyOption,
  version: 4 | 5,
): V4V5CurrencyOption => {
  if (v2v3CurrencyOption === V2V3_CURRENCY_ETH) {
    return V4V5_CURRENCY_ETH
  }
  return getV4V5CurrencyUSD(version)
}
