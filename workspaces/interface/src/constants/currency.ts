import { CSSProperties } from 'react'

export type CurrencyName = 'ETH' | 'USD'
export type CurrencySymbol = 'Ξ' | 'US$'
export type CurrencyMetadata = {
  name: CurrencyName
  symbol: CurrencySymbol
  style?: CSSProperties
}

export const CURRENCY_METADATA: Record<CurrencyName, CurrencyMetadata> = {
  ETH: {
    name: 'ETH',
    symbol: 'Ξ',
    style: {
      fontFamily: 'sans-serif',
    },
  },
  USD: {
    name: 'USD',
    symbol: 'US$',
  },
}

export const PRECISION_USD = 2
export const PRECISION_ETH = 4
