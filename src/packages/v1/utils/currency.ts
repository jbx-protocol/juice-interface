import { V1CurrencyOption } from 'packages/v1/models/currencyOption'

import { CurrencyName } from 'constants/currency'

import {
  V1_CURRENCY_ETH,
  V1_CURRENCY_METADATA,
  V1_CURRENCY_USD,
} from 'packages/v1/constants/currency'

export const V1CurrencyName = (
  currency?: V1CurrencyOption,
): CurrencyName | undefined =>
  currency !== undefined ? V1_CURRENCY_METADATA[currency].name : undefined

export const getV1CurrencyOption = (
  currencyName: CurrencyName,
): V1CurrencyOption =>
  currencyName === 'ETH' ? V1_CURRENCY_ETH : V1_CURRENCY_USD
