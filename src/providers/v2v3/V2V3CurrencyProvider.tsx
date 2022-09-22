import { CurrencyContext } from 'contexts/currencyContext'
import React from 'react'
import {
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_METADATA,
  V2V3_CURRENCY_USD,
} from 'utils/v2v3/currency'

const V2_CURRENCY_CONTEXT = {
  currencyMetadata: V2V3_CURRENCY_METADATA,
  currencies: { ETH: V2V3_CURRENCY_ETH, USD: V2V3_CURRENCY_USD },
}

export const V2V3CurrencyProvider: React.FC = ({ children }) => {
  return (
    <CurrencyContext.Provider value={V2_CURRENCY_CONTEXT}>
      {children}
    </CurrencyContext.Provider>
  )
}
