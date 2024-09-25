export type CurrencyName = 'ETH' | 'USD' | 'SepETH'
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
  SepETH: {
    name: 'SepETH',
    symbol: 'Ξ',
  },
  USD: {
    name: 'USD',
    symbol: 'US$',
  },
}

export const PRECISION_USD = 2
export const PRECISION_ETH = 4
