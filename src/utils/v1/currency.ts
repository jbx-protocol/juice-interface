import { V1CurrencyOption } from 'models/v1/currencyOption'
import { CSSProperties } from 'react'

import { V2CurrencyOption } from 'models/v2/currencyOption'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'constants/v2/currency'

const CURRENCY_MAP: { [key in V2CurrencyOption]: V1CurrencyOption } = {
  [V2_CURRENCY_ETH]: V1_CURRENCY_ETH,
  [V2_CURRENCY_USD]: V1_CURRENCY_USD,
}

const currencies: Record<
  V1CurrencyOption,
  { name: 'ETH' | 'USD'; symbol: 'Ξ' | 'US$'; style?: CSSProperties }
> = {
  [V1_CURRENCY_ETH]: {
    name: 'ETH',
    symbol: 'Ξ',
    style: {
      fontFamily: 'sans-serif',
    },
  },
  [V1_CURRENCY_USD]: {
    name: 'USD',
    symbol: 'US$',
  },
}

export const currencyName = (
  currency?: V1CurrencyOption,
): typeof currencies[keyof typeof currencies]['name'] | undefined =>
  currency !== undefined ? currencies[currency].name : undefined

export const currencySymbol = (currency?: V1CurrencyOption) =>
  currency !== undefined ? currencies[currency].symbol : undefined

export const currencyStyle = (currency?: V1CurrencyOption) =>
  currency !== undefined ? currencies[currency].style : undefined

export const toV1Currency = (
  v2Currency: V2CurrencyOption,
): V1CurrencyOption => {
  console.log('v2Currency', v2Currency)
  return CURRENCY_MAP[v2Currency]
}
