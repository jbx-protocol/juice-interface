import { CurrencyContext } from 'contexts/currencyContext'

import { PropsWithChildren } from 'react'

import { V1_CURRENCY_CONTEXT } from 'constants/v1/currency'

export default function V1CurrencyProvider({
  children,
}: PropsWithChildren<{}>) {
  return (
    <CurrencyContext.Provider value={V1_CURRENCY_CONTEXT}>
      {children}
    </CurrencyContext.Provider>
  )
}
