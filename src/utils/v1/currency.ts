import { V1CurrencyOption } from 'models/v1/currencyOption'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'utils/v2/currency'

import { CurrencyName, CurrencySymbol } from 'constants/currency'

import {
  V1_CURRENCY_ETH,
  V1_CURRENCY_METADATA,
  V1_CURRENCY_USD,
} from 'constants/v1/currency'

const CURRENCY_MAP: { [key in V2CurrencyOption]: V1CurrencyOption } = {
  [V2_CURRENCY_ETH]: V1_CURRENCY_ETH,
  [V2_CURRENCY_USD]: V1_CURRENCY_USD,
}

export const V1CurrencyName = (
  currency?: V1CurrencyOption,
): CurrencyName | undefined =>
  currency !== undefined ? V1_CURRENCY_METADATA[currency].name : undefined

export const getV1CurrencyOption = (
  currencyName: CurrencyName,
): V1CurrencyOption =>
  currencyName === 'ETH' ? V1_CURRENCY_ETH : V1_CURRENCY_USD

export const V1CurrencySymbol = (
  currency?: V1CurrencyOption,
): CurrencySymbol | undefined =>
  currency !== undefined ? V1_CURRENCY_METADATA[currency].symbol : undefined

export const V1CurrencyStyle = (currency?: V1CurrencyOption) =>
  currency !== undefined ? V1_CURRENCY_METADATA[currency].style : undefined

export const toV1Currency = (
  v2Currency: V2CurrencyOption,
): V1CurrencyOption => {
  return CURRENCY_MAP[v2Currency]
}
