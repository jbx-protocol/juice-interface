import { createContext } from 'react'
import {
  V2_CURRENCY_ETH,
  V2_CURRENCY_METADATA,
  V2_CURRENCY_USD,
} from 'utils/v2/currency'

import { CurrencyOption } from 'models/currencyOption'

import { CurrencyMetadata, CurrencyName } from 'constants/currency'

// TODO make this CurrencyOption instead of number
type CurrencyMetadataType = Record<number, CurrencyMetadata>

type CurrencyContextType = {
  currencyMetadata: CurrencyMetadataType
  currencies: Record<CurrencyName, CurrencyOption>
}

// Defaults to V2
export const CurrencyContext = createContext<CurrencyContextType>({
  currencyMetadata: V2_CURRENCY_METADATA,
  currencies: { ETH: V2_CURRENCY_ETH, USD: V2_CURRENCY_USD },
})
