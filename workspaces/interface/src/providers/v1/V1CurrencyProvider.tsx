import { CurrencyContext } from 'contexts/currencyContext'

import React from 'react'

import { V1_CURRENCY_CONTEXT } from 'constants/v1/currency'

export const V1CurrencyProvider: React.FC = ({ children }) => {
  return (
    <CurrencyContext.Provider value={V1_CURRENCY_CONTEXT}>
      {children}
    </CurrencyContext.Provider>
  )
}
