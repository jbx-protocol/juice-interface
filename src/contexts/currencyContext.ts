import { createContext } from 'react'
import {
  V2_CURRENCY_ETH,
  V2_CURRENCY_USD,
  V2_CURRENCY_METADATA,
} from 'utils/v2/currency'

import { CurrencyMetadata } from 'constants/currency'

export type CurrencyMetadataType = Record<number, CurrencyMetadata>

export type CurrencyContextType = {
  currencyMetadata: CurrencyMetadataType
  currencies: Record<string, number>
}

// Defaults to V2
export const CurrencyContext = createContext<CurrencyContextType>({
  currencyMetadata: V2_CURRENCY_METADATA,
  currencies: { currencyETH: V2_CURRENCY_ETH, currencyUSD: V2_CURRENCY_USD },
})
