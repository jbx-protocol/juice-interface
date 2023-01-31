export type CurrencyName = 'ETH' | 'USD'
type CurrencySymbol = 'Ξ' | 'US$'
export type CurrencyMetadata = {
  name: CurrencyName
  symbol: CurrencySymbol
}

export const CURRENCY_METADATA: Record<CurrencyName, CurrencyMetadata> = {
  ETH: {
    name: 'ETH',
    symbol: 'Ξ',
  },
  USD: {
    name: 'USD',
    symbol: 'US$',
  },
}

export const PRECISION_USD = 2
export const PRECISION_ETH = 4
