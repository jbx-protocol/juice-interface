import { V1CurrencyOption } from 'models/v1/currencyOption'
import { CSSProperties } from 'react'

import { V2CurrencyOption } from 'models/v2/currencyOption'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'constants/v2/currency'

const currencies: Record<
  V2CurrencyOption,
  { name: 'ETH' | 'USD'; symbol: 'Ξ' | 'US$'; style?: CSSProperties }
> = {
  [V2_CURRENCY_ETH]: {
    name: 'ETH',
    symbol: 'Ξ',
    style: {
      fontFamily: 'sans-serif',
    },
  },
  [V2_CURRENCY_USD]: {
    name: 'USD',
    symbol: 'US$',
  },
}

export const currencyName = (
  currency?: V2CurrencyOption,
): typeof currencies[keyof typeof currencies]['name'] | undefined =>
  currency !== undefined ? currencies[currency].name : undefined

export const currencySymbol = (currency?: V2CurrencyOption) =>
  currency !== undefined ? currencies[currency].symbol : undefined

export const currencyStyle = (currency?: V2CurrencyOption) =>
  currency !== undefined ? currencies[currency].style : undefined

const CURRENCY_MAP: { [key in V1CurrencyOption]: V2CurrencyOption } = {
  [V1_CURRENCY_ETH]: V2_CURRENCY_ETH,
  [V1_CURRENCY_USD]: V2_CURRENCY_USD,
}

export const toV2Currency = (
  v1Currency: V1CurrencyOption,
): V2CurrencyOption => {
  return CURRENCY_MAP[v1Currency]
}
