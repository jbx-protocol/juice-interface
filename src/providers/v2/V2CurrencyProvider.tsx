import { CurrencyContext } from 'contexts/currencyContext'

import { PropsWithChildren } from 'react'

import { V2_CURRENCY_CONTEXT } from 'constants/v2/currency'

export default function V2CurrencyProvider({
  children,
}: PropsWithChildren<{}>) {
  return (
    <CurrencyContext.Provider value={V2_CURRENCY_CONTEXT}>
      {children}
    </CurrencyContext.Provider>
  )
}
