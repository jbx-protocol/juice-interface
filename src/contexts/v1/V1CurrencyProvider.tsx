import { CurrencyContext } from 'contexts/shared/CurrencyContext'

import React from 'react'

import { V1_CURRENCY_CONTEXT } from 'constants/v1/currency'

export const V1CurrencyProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <CurrencyContext.Provider value={V1_CURRENCY_CONTEXT}>
      {children}
    </CurrencyContext.Provider>
  )
}
