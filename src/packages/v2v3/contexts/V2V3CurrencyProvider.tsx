import { CurrencyContext } from 'contexts/CurrencyContext'
import {
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_METADATA,
  V2V3_CURRENCY_USD,
} from 'packages/v2v3/utils/currency'
import React from 'react'

const V2_CURRENCY_CONTEXT = {
  currencyMetadata: V2V3_CURRENCY_METADATA,
  currencies: { ETH: V2V3_CURRENCY_ETH, USD: V2V3_CURRENCY_USD },
}

export const V2V3CurrencyProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  return (
    <CurrencyContext.Provider value={V2_CURRENCY_CONTEXT}>
      {children}
    </CurrencyContext.Provider>
  )
}
