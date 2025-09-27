import {
  CURRENCY_METADATA,
  CurrencyMetadata,
  CurrencyName,
} from 'constants/currency'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'packages/v2v3/utils/currency'
import {
  V4CurrencyETH,
  V4V5CurrencyOption,
  V4CurrencyUSD,
} from '../models/v4CurrencyOption'

import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'

export const V4V5_CURRENCY_ETH: V4CurrencyETH = 1 
export const V4V5_CURRENCY_USD: V4CurrencyUSD = 2

export const V4V5_CURRENCY_METADATA: Record<V4V5CurrencyOption, CurrencyMetadata> =
  {
    [V4V5_CURRENCY_ETH]: CURRENCY_METADATA.ETH,
    [V4V5_CURRENCY_USD]: CURRENCY_METADATA.USD,
  }

export const V4V5CurrencyName = (
  currency?: V4V5CurrencyOption,
): CurrencyName | undefined =>
  currency !== undefined ? V4V5_CURRENCY_METADATA[currency]?.name : undefined

export const getV4V5CurrencyOption = (
  currencyName: CurrencyName,
): V4V5CurrencyOption =>
  currencyName === 'ETH' ? V4V5_CURRENCY_ETH : V4V5_CURRENCY_USD

  
export const convertV4V5CurrencyOptionToV2V3 = (v4CurrencyOption: V4V5CurrencyOption): V2V3CurrencyOption => {
  const conversionTable = {
    [V4V5_CURRENCY_ETH]: V2V3_CURRENCY_ETH,
    [V4V5_CURRENCY_USD]: V2V3_CURRENCY_USD,
  }

  return conversionTable[v4CurrencyOption]
}

export const convertV2V3CurrencyOptionToV4 = (
  v2v3CurrencyOption: V2V3CurrencyOption,
): V4V5CurrencyOption => {
  const conversionTable = {
    [V2V3_CURRENCY_ETH]: V4V5_CURRENCY_ETH,
    [V2V3_CURRENCY_USD]: V4V5_CURRENCY_USD,
  }

  return conversionTable[v2v3CurrencyOption]
}
