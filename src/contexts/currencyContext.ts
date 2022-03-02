import { createContext } from 'react'

import { CurrencyMetadata } from 'constants/currency'

export type CurrencyMetadataType = Record<number, CurrencyMetadata>

export type CurrencyContextType = {
  currencyMetadata: CurrencyMetadataType | undefined
  currencyETH: number | undefined
  currencyUSD: number | undefined
}

// Defaults to V2
export const CurrencyContext = createContext<CurrencyContextType>({
  currencyMetadata: undefined,
  currencyETH: undefined,
  currencyUSD: undefined,
})
