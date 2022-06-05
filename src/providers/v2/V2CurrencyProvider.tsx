import { CurrencyContext } from 'contexts/currencyContext'
import React from 'react'

import { V2_CURRENCY_CONTEXT } from 'constants/v2/currency'

export const V2CurrencyProvider: React.FC = ({ children }) => {
  return (
    <CurrencyContext.Provider value={V2_CURRENCY_CONTEXT}>
      {children}
    </CurrencyContext.Provider>
  )
}
